import type { APIRoute, GetStaticPaths } from "astro";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { getAllReports, getReport } from "../../lib/reports";

export const getStaticPaths: GetStaticPaths = () => {
  return getAllReports().map(({ date, slug }) => ({
    params: { slug: `${date}/${slug}` },
    props: { date, slug },
  }));
};

async function loadFont(): Promise<ArrayBuffer> {
  const res = await fetch(
    "https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfMZg.ttf"
  );
  return res.arrayBuffer();
}

async function loadSerifFont(): Promise<ArrayBuffer> {
  const res = await fetch(
    "https://fonts.gstatic.com/s/instrumentserif/v5/jizHRFtNs2ka5fXjeivQ4LroWlx-6zATiw.ttf"
  );
  return res.arrayBuffer();
}

export const GET: APIRoute = async ({ props }) => {
  const { date, slug } = props as { date: string; slug: string };
  const report = getReport(date, slug);
  if (!report) return new Response("Not found", { status: 404 });

  const [sansFont, serifFont] = await Promise.all([loadFont(), loadSerifFont()]);

  const bottomLine =
    report.brief.bottomLine.length > 180
      ? report.brief.bottomLine.slice(0, 177) + "..."
      : report.brief.bottomLine;

  const title =
    report.title.length > 60
      ? report.title.slice(0, 57) + "..."
      : report.title;

  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "70px 80px",
          background: "linear-gradient(135deg, #1a1a18 0%, #2a2826 100%)",
          fontFamily: "Inter",
        },
        children: [
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                alignItems: "center",
                gap: "16px",
                marginBottom: "32px",
              },
              children: [
                {
                  type: "span",
                  props: {
                    style: {
                      fontSize: "22px",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.12em",
                      color: "#c43d2e",
                    },
                    children: report.category,
                  },
                },
                {
                  type: "span",
                  props: {
                    style: {
                      fontSize: "22px",
                      color: "#666660",
                    },
                    children: report.date,
                  },
                },
              ],
            },
          },
          {
            type: "div",
            props: {
              style: {
                fontSize: "76px",
                fontFamily: "Instrument Serif",
                lineHeight: 1.05,
                color: "#fafaf8",
              },
              children: title,
            },
          },
          {
            type: "div",
            props: {
              style: {
                marginTop: "32px",
                borderLeft: "4px solid #c43d2e",
                paddingLeft: "24px",
                fontSize: "30px",
                fontFamily: "Instrument Serif",
                fontStyle: "italic",
                lineHeight: 1.35,
                color: "#a0a098",
              },
              children: bottomLine,
            },
          },
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "auto",
                paddingTop: "40px",
              },
              children: [
                {
                  type: "span",
                  props: {
                    style: {
                      fontSize: "34px",
                      fontFamily: "Instrument Serif",
                      fontStyle: "italic",
                      color: "#fafaf8",
                    },
                    children: "PhilOS",
                  },
                },
                {
                  type: "span",
                  props: {
                    style: {
                      fontSize: "22px",
                      fontWeight: 600,
                      color: "#c43d2e",
                    },
                    children: "Read the brief →",
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Inter", data: sansFont, weight: 400, style: "normal" },
        { name: "Inter", data: sansFont, weight: 600, style: "normal" },
        { name: "Instrument Serif", data: serifFont, weight: 400, style: "normal" },
      ],
    }
  );

  const resvg = new Resvg(svg, { fitTo: { mode: "width", value: 1200 } });
  const png = resvg.render().asPng();

  return new Response(png, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=86400",
    },
  });
};
