import { NextResponse } from "next/server";
import { requireSession } from "@/lib/apiAuth";
import { getDailyHistory } from "@/lib/seedData";
import { combinedForecastSeries, forecastNext30Days, forecastTomorrow } from "@/lib/occupancyPredictor";

export const dynamic = "force-dynamic";

export async function GET() {
  const { error } = await requireSession();
  if (error) return error;

  const history = getDailyHistory();
  const { forecast } = forecastNext30Days(history);

  return NextResponse.json({
    model: "weighted-moving-average with Kenyan seasonality flags",
    usesExternalAi: false,
    generatedAt: new Date().toISOString(),
    tomorrow: forecastTomorrow(history),
    forecast,
    series: combinedForecastSeries(history),
  });
}
