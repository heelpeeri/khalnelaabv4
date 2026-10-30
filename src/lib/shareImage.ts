import { getRoundsLabel } from "@/lib/matchLabels";
import type { WinnerType } from "@/types/game";

type ShareRoundStat = {
  winner: WinnerType;
};

export type ShareResultData = {
  isDraw: boolean;
  finalWinnerName: string;
  side1: string;
  side2: string;
  side1Score: number;
  side2Score: number;
  roundStats: ShareRoundStat[];
};

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  const r = Math.min(radius, width / 2, height / 2);

  ctx.beginPath();

  ctx.moveTo(x + r, y);

  ctx.lineTo(x + width - r, y);

  ctx.quadraticCurveTo(x + width, y, x + width, y + r);

  ctx.lineTo(x + width, y + height - r);

  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);

  ctx.lineTo(x + r, y + height);

  ctx.quadraticCurveTo(x, y + height, x, y + height - r);

  ctx.lineTo(x, y + r);

  ctx.quadraticCurveTo(x, y, x + r, y);

  ctx.closePath();
}

function getVisibleBounds(image: HTMLImageElement) {
  const full = {
    x: 0,
    y: 0,
    width: image.naturalWidth,
    height: image.naturalHeight,
  };

  const canvas = document.createElement("canvas");
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;

  const ctx = canvas.getContext("2d");

  if (!ctx) return full;

  ctx.drawImage(image, 0, 0);

  const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);

  let minX = canvas.width;
  let minY = canvas.height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < canvas.height; y += 1) {
    for (let x = 0; x < canvas.width; x += 1) {
      if (data[(y * canvas.width + x) * 4 + 3] > 8) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }

  if (maxX < minX || maxY < minY) return full;

  return {
    x: minX,
    y: minY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
  };
}

export async function createResultShareImage({
  isDraw,
  finalWinnerName,
  side1,
  side2,
  side1Score,
  side2Score,
  roundStats,
}: ShareResultData) {
  const canvas = document.createElement("canvas");

  canvas.width = 1080;
  canvas.height = 1350;

  const logo = await new Promise<HTMLImageElement | null>((resolve) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = "/logo.png";
  });

  const fontFamily =
    getComputedStyle(document.body).fontFamily || "Arial, sans-serif";

  try {
    await Promise.all([
      document.fonts.load(`700 40px ${fontFamily}`, "خل نلعب"),
      document.fonts.load(`500 28px ${fontFamily}`, "خل نلعب"),
    ]);
  } catch {}

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Canvas غير مدعوم");
  }

  const { width, height } = canvas;

  const background = ctx.createLinearGradient(0, 0, width, height);

  background.addColorStop(0, "#06020e");

  background.addColorStop(0.5, "#170628");

  background.addColorStop(1, "#050914");

  ctx.fillStyle = background;

  ctx.fillRect(0, 0, width, height);

  const pinkGlow = ctx.createRadialGradient(930, 470, 20, 930, 470, 430);

  pinkGlow.addColorStop(0, "rgba(217,70,239,0.30)");

  pinkGlow.addColorStop(1, "rgba(217,70,239,0)");

  ctx.fillStyle = pinkGlow;

  ctx.fillRect(0, 0, width, height);

  const cyanGlow = ctx.createRadialGradient(150, 500, 20, 150, 500, 430);

  cyanGlow.addColorStop(0, "rgba(34,211,238,0.25)");

  cyanGlow.addColorStop(1, "rgba(34,211,238,0)");

  ctx.fillStyle = cyanGlow;

  ctx.fillRect(0, 0, width, height);

  drawRoundedRect(ctx, 65, 60, 950, 1230, 48);

  const cardGradient = ctx.createLinearGradient(65, 60, 1015, 1290);

  cardGradient.addColorStop(0, "rgba(33,8,57,0.96)");

  cardGradient.addColorStop(1, "rgba(9,6,27,0.98)");

  ctx.fillStyle = cardGradient;

  ctx.fill();

  ctx.lineWidth = 5;

  ctx.strokeStyle = "rgba(34,211,238,0.65)";

  ctx.stroke();

  ctx.textAlign = "center";

  ctx.direction = "rtl";

  if (logo) {
    const bounds = getVisibleBounds(logo);
    const logoHeight = 160;
    const logoWidth = (bounds.width / bounds.height) * logoHeight;

    ctx.drawImage(
      logo,
      bounds.x,
      bounds.y,
      bounds.width,
      bounds.height,
      (width - logoWidth) / 2,
      70,
      logoWidth,
      logoHeight,
    );
  } else {
    ctx.fillStyle = "#67e8f9";

    ctx.font = `900 44px ${fontFamily}`;

    ctx.fillText("خل نلعب", width / 2, 170);
  }

  ctx.fillStyle = "#ffffff";

  ctx.font = `900 72px ${fontFamily}`;

  ctx.fillText(isDraw ? "تعادل! 🤝" : "كفووو! 🏆", width / 2, 300);

  ctx.font = `900 40px ${fontFamily}`;

  ctx.fillStyle = "#f5e9ff";

  ctx.fillText(
    isDraw ? "الفريقين قدّها" : `الفائز: ${finalWinnerName}`,
    width / 2,
    370,
    940,
  );

  drawRoundedRect(ctx, 585, 445, 390, 270, 38);

  const team1Gradient = ctx.createLinearGradient(585, 445, 975, 715);

  team1Gradient.addColorStop(0, "rgba(217,70,239,0.55)");

  team1Gradient.addColorStop(1, "rgba(126,34,206,0.25)");

  ctx.fillStyle = team1Gradient;

  ctx.fill();

  ctx.strokeStyle = "rgba(240,171,252,0.75)";

  ctx.lineWidth = 3;

  ctx.stroke();

  ctx.fillStyle = "#fae8ff";

  ctx.font = `900 32px ${fontFamily}`;

  ctx.fillText(side1 || "فريق 1", 780, 515, 340);

  ctx.font = `900 110px ${fontFamily}`;

  ctx.fillText(String(side1Score), 780, 645);

  drawRoundedRect(ctx, 105, 445, 390, 270, 38);

  const team2Gradient = ctx.createLinearGradient(105, 445, 495, 715);

  team2Gradient.addColorStop(0, "rgba(34,211,238,0.52)");

  team2Gradient.addColorStop(1, "rgba(37,99,235,0.25)");

  ctx.fillStyle = team2Gradient;

  ctx.fill();

  ctx.strokeStyle = "rgba(103,232,249,0.75)";

  ctx.lineWidth = 3;

  ctx.stroke();

  ctx.fillStyle = "#cffafe";

  ctx.font = `900 32px ${fontFamily}`;

  ctx.fillText(side2 || "فريق 2", 300, 515, 340);

  ctx.font = `900 110px ${fontFamily}`;

  ctx.fillText(String(side2Score), 300, 645);

  ctx.fillStyle = "rgba(255,255,255,0.35)";

  ctx.font = `900 48px ${fontFamily}`;

  ctx.fillText("-", width / 2, 595);

  const draws = roundStats.filter((stat) => stat.winner === "none").length;

  const roundText = getRoundsLabel(roundStats.length);

  const drawText =
    draws === 0 ? "بدون تعادل" : draws === 1 ? "تعادل واحد" : `${draws} تعادل`;

  ctx.fillStyle = "#ffffff";

  ctx.font = `900 40px ${fontFamily}`;

  ctx.fillText("نتيجة الجلسة", width / 2, 810);

  ctx.fillStyle = "rgba(255,255,255,0.68)";

  ctx.font = `700 28px ${fontFamily}`;

  ctx.fillText(`${roundText}  •  ${drawText}`, width / 2, 865);

  drawRoundedRect(ctx, 145, 950, 790, 205, 38);

  ctx.fillStyle = "rgba(255,255,255,0.055)";

  ctx.fill();

  ctx.strokeStyle = "rgba(255,255,255,0.12)";

  ctx.lineWidth = 2;

  ctx.stroke();

  ctx.fillStyle = "#ffffff";

  ctx.font = `900 44px ${fontFamily}`;

  ctx.fillText("تقدرون تتحدونا؟ 👀", width / 2, 1030);

  ctx.fillStyle = "rgba(255,255,255,0.60)";

  ctx.font = `700 27px ${fontFamily}`;

  ctx.fillText("العبوا خل نلعب وشوفوا مين يفوز", width / 2, 1090);

  ctx.fillStyle = "rgba(255,255,255,0.38)";

  ctx.font = `600 23px ${fontFamily}`;

  ctx.fillText(window.location.host, width / 2, 1235);

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/png", 1);
  });

  if (!blob) {
    throw new Error("فشل إنشاء صورة النتيجة");
  }

  return new File([blob], "khal-nelab-result.png", {
    type: "image/png",
  });
}
