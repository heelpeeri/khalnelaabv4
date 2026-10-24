const ECC_CODEWORDS_PER_BLOCK = [
  -1, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26,
  26, 26, 26, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28,
  28, 28, 28,
];

const NUM_ERROR_CORRECTION_BLOCKS = [
  -1, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16, 17,
  17, 18, 20, 21, 23, 25, 26, 28, 29, 31, 33, 35, 37, 38, 40, 43, 45, 47, 49,
];

const ECC_FORMAT_BITS = 0;

function getBit(value: number, index: number) {
  return ((value >>> index) & 1) !== 0;
}

function getNumRawDataModules(version: number) {
  let result = (16 * version + 128) * version + 64;

  if (version >= 2) {
    const numAlign = Math.floor(version / 7) + 2;
    result -= (25 * numAlign - 10) * numAlign - 55;

    if (version >= 7) {
      result -= 36;
    }
  }

  return result;
}

function getNumDataCodewords(version: number) {
  return (
    Math.floor(getNumRawDataModules(version) / 8) -
    ECC_CODEWORDS_PER_BLOCK[version] * NUM_ERROR_CORRECTION_BLOCKS[version]
  );
}

function multiply(x: number, y: number) {
  let z = 0;

  for (let i = 7; i >= 0; i -= 1) {
    z = (z << 1) ^ ((z >>> 7) * 0x11d);
    z ^= ((y >>> i) & 1) * x;
  }

  return z;
}

function computeDivisor(degree: number) {
  const result: number[] = new Array(degree).fill(0);
  result[degree - 1] = 1;

  let root = 1;

  for (let i = 0; i < degree; i += 1) {
    for (let j = 0; j < result.length; j += 1) {
      result[j] = multiply(result[j], root);

      if (j + 1 < result.length) {
        result[j] ^= result[j + 1];
      }
    }

    root = multiply(root, 0x02);
  }

  return result;
}

function computeRemainder(data: number[], divisor: number[]) {
  const result: number[] = divisor.map(() => 0);

  for (const byte of data) {
    const factor = byte ^ (result.shift() as number);
    result.push(0);

    divisor.forEach((coefficient, i) => {
      result[i] ^= multiply(coefficient, factor);
    });
  }

  return result;
}

function getAlignmentPositions(version: number, size: number) {
  if (version === 1) {
    return [];
  }

  const numAlign = Math.floor(version / 7) + 2;
  const step =
    version === 32
      ? 26
      : Math.ceil((version * 4 + 4) / (numAlign * 2 - 2)) * 2;

  const result = [6];

  for (let pos = size - 7; result.length < numAlign; pos -= step) {
    result.splice(1, 0, pos);
  }

  return result;
}

function encodeData(bytes: Uint8Array) {
  let version = 1;

  for (; version <= 40; version += 1) {
    const countBits = version <= 9 ? 8 : 16;

    if (4 + countBits + bytes.length * 8 <= getNumDataCodewords(version) * 8) {
      break;
    }
  }

  if (version > 40) {
    throw new Error("QR data too long");
  }

  const bits: number[] = [];

  const append = (value: number, length: number) => {
    for (let i = length - 1; i >= 0; i -= 1) {
      bits.push((value >>> i) & 1);
    }
  };

  append(0x4, 4);
  append(bytes.length, version <= 9 ? 8 : 16);
  bytes.forEach((byte) => append(byte, 8));

  const capacity = getNumDataCodewords(version) * 8;

  append(0, Math.min(4, capacity - bits.length));
  append(0, (8 - (bits.length % 8)) % 8);

  for (let pad = 0xec; bits.length < capacity; pad ^= 0xec ^ 0x11) {
    append(pad, 8);
  }

  const codewords: number[] = [];

  for (let i = 0; i < bits.length; i += 8) {
    let byte = 0;

    for (let j = 0; j < 8; j += 1) {
      byte = (byte << 1) | bits[i + j];
    }

    codewords.push(byte);
  }

  return { version, codewords };
}

function addEccAndInterleave(version: number, data: number[]) {
  const numBlocks = NUM_ERROR_CORRECTION_BLOCKS[version];
  const blockEccLen = ECC_CODEWORDS_PER_BLOCK[version];
  const rawCodewords = Math.floor(getNumRawDataModules(version) / 8);
  const numShortBlocks = numBlocks - (rawCodewords % numBlocks);
  const shortBlockLen = Math.floor(rawCodewords / numBlocks);
  const divisor = computeDivisor(blockEccLen);

  const blocks: number[][] = [];

  for (let i = 0, k = 0; i < numBlocks; i += 1) {
    const block = data.slice(
      k,
      k + shortBlockLen - blockEccLen + (i < numShortBlocks ? 0 : 1)
    );

    k += block.length;

    const ecc = computeRemainder(block, divisor);

    if (i < numShortBlocks) {
      block.push(0);
    }

    blocks.push(block.concat(ecc));
  }

  const result: number[] = [];

  for (let i = 0; i < blocks[0].length; i += 1) {
    blocks.forEach((block, j) => {
      if (i !== shortBlockLen - blockEccLen || j >= numShortBlocks) {
        result.push(block[i]);
      }
    });
  }

  return result;
}

function shouldInvert(mask: number, x: number, y: number) {
  switch (mask) {
    case 0:
      return (x + y) % 2 === 0;
    case 1:
      return y % 2 === 0;
    case 2:
      return x % 3 === 0;
    case 3:
      return (x + y) % 3 === 0;
    case 4:
      return (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0;
    case 5:
      return ((x * y) % 2) + ((x * y) % 3) === 0;
    case 6:
      return (((x * y) % 2) + ((x * y) % 3)) % 2 === 0;
    default:
      return (((x + y) % 2) + ((x * y) % 3)) % 2 === 0;
  }
}

function getPenalty(modules: boolean[][]) {
  const size = modules.length;
  let penalty = 0;

  const scanLine = (get: (i: number) => boolean) => {
    let runColor = get(0);
    let runLength = 1;

    for (let i = 1; i <= size; i += 1) {
      if (i < size && get(i) === runColor) {
        runLength += 1;
        continue;
      }

      if (runLength >= 5) {
        penalty += runLength - 2;
      }

      if (i < size) {
        runColor = get(i);
        runLength = 1;
      }
    }

    for (let i = 0; i + 7 <= size; i += 1) {
      const pattern =
        get(i) &&
        !get(i + 1) &&
        get(i + 2) &&
        get(i + 3) &&
        get(i + 4) &&
        !get(i + 5) &&
        get(i + 6);

      if (!pattern) continue;

      const lightBefore = [1, 2, 3, 4].every(
        (d) => i - d < 0 || !get(i - d)
      );
      const lightAfter = [7, 8, 9, 10].every(
        (d) => i + d >= size || !get(i + d)
      );

      if (lightBefore || lightAfter) {
        penalty += 40;
      }
    }
  };

  for (let y = 0; y < size; y += 1) {
    scanLine((x) => modules[y][x]);
  }

  for (let x = 0; x < size; x += 1) {
    scanLine((y) => modules[y][x]);
  }

  let dark = 0;

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      if (modules[y][x]) dark += 1;

      if (
        x < size - 1 &&
        y < size - 1 &&
        modules[y][x] === modules[y][x + 1] &&
        modules[y][x] === modules[y + 1][x] &&
        modules[y][x] === modules[y + 1][x + 1]
      ) {
        penalty += 3;
      }
    }
  }

  const total = size * size;
  penalty += Math.floor(Math.abs(dark * 20 - total * 10) / total) * 10;

  return penalty;
}

export function createQrMatrix(text: string): boolean[][] {
  const { version, codewords } = encodeData(new TextEncoder().encode(text));
  const size = version * 4 + 17;

  const modules: boolean[][] = Array.from({ length: size }, () =>
    new Array(size).fill(false)
  );
  const isFunction: boolean[][] = Array.from({ length: size }, () =>
    new Array(size).fill(false)
  );

  const setFunction = (x: number, y: number, dark: boolean) => {
    modules[y][x] = dark;
    isFunction[y][x] = true;
  };

  for (let i = 0; i < size; i += 1) {
    setFunction(6, i, i % 2 === 0);
    setFunction(i, 6, i % 2 === 0);
  }

  const drawFinder = (cx: number, cy: number) => {
    for (let dy = -4; dy <= 4; dy += 1) {
      for (let dx = -4; dx <= 4; dx += 1) {
        const dist = Math.max(Math.abs(dx), Math.abs(dy));
        const x = cx + dx;
        const y = cy + dy;

        if (x >= 0 && x < size && y >= 0 && y < size) {
          setFunction(x, y, dist !== 2 && dist !== 4);
        }
      }
    }
  };

  drawFinder(3, 3);
  drawFinder(size - 4, 3);
  drawFinder(3, size - 4);

  const alignPositions = getAlignmentPositions(version, size);
  const last = alignPositions.length - 1;

  alignPositions.forEach((ay, i) => {
    alignPositions.forEach((ax, j) => {
      if (
        (i === 0 && j === 0) ||
        (i === 0 && j === last) ||
        (i === last && j === 0)
      ) {
        return;
      }

      for (let dy = -2; dy <= 2; dy += 1) {
        for (let dx = -2; dx <= 2; dx += 1) {
          setFunction(
            ax + dx,
            ay + dy,
            Math.max(Math.abs(dx), Math.abs(dy)) !== 1
          );
        }
      }
    });
  });

  const drawFormatBits = (mask: number) => {
    const data = (ECC_FORMAT_BITS << 3) | mask;
    let rem = data;

    for (let i = 0; i < 10; i += 1) {
      rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
    }

    const bits = ((data << 10) | rem) ^ 0x5412;

    for (let i = 0; i <= 5; i += 1) setFunction(8, i, getBit(bits, i));
    setFunction(8, 7, getBit(bits, 6));
    setFunction(8, 8, getBit(bits, 7));
    setFunction(7, 8, getBit(bits, 8));
    for (let i = 9; i < 15; i += 1) setFunction(14 - i, 8, getBit(bits, i));

    for (let i = 0; i < 8; i += 1) setFunction(size - 1 - i, 8, getBit(bits, i));
    for (let i = 8; i < 15; i += 1) setFunction(8, size - 15 + i, getBit(bits, i));
    setFunction(8, size - 8, true);
  };

  drawFormatBits(0);

  if (version >= 7) {
    let rem = version;

    for (let i = 0; i < 12; i += 1) {
      rem = (rem << 1) ^ ((rem >>> 11) * 0x1f25);
    }

    const bits = (version << 12) | rem;

    for (let i = 0; i < 18; i += 1) {
      const bit = getBit(bits, i);
      const a = size - 11 + (i % 3);
      const b = Math.floor(i / 3);
      setFunction(a, b, bit);
      setFunction(b, a, bit);
    }
  }

  const data = addEccAndInterleave(version, codewords);
  let bitIndex = 0;

  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5;

    for (let vert = 0; vert < size; vert += 1) {
      for (let j = 0; j < 2; j += 1) {
        const x = right - j;
        const upward = ((right + 1) & 2) === 0;
        const y = upward ? size - 1 - vert : vert;

        if (!isFunction[y][x] && bitIndex < data.length * 8) {
          modules[y][x] = getBit(data[bitIndex >>> 3], 7 - (bitIndex & 7));
          bitIndex += 1;
        }
      }
    }
  }

  const applyMask = (mask: number) => {
    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        if (!isFunction[y][x] && shouldInvert(mask, x, y)) {
          modules[y][x] = !modules[y][x];
        }
      }
    }
  };

  let bestMask = 0;
  let bestPenalty = Infinity;

  for (let mask = 0; mask < 8; mask += 1) {
    applyMask(mask);
    drawFormatBits(mask);

    const penalty = getPenalty(modules);

    if (penalty < bestPenalty) {
      bestPenalty = penalty;
      bestMask = mask;
    }

    applyMask(mask);
  }

  applyMask(bestMask);
  drawFormatBits(bestMask);

  return modules;
}
