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
    report.title.length > 80
      ? report.title.slice(0, 77) + "..."
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
          justifyContent: "space-between",
          padding: "60px",
          background: "#fafaf8",
          fontFamily: "Inter",
        },
        children: [
          {
            type: "div",
            props: {
              style: { display: "flex", flexDirection: "column" },
              children: [
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      marginBottom: "24px",
                    },
                    children: [
                      {
                        type: "span",
                        props: {
                          style: {
                            fontSize: "14px",
                            fontWeight: 600,
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            color: "#c43d2e",
                          },
                          children: report.category,
                        },
                      },
                      {
                        type: "span",
                        props: {
                          style: {
                            fontSize: "14px",
                            color: "#8a8a82",
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
                      fontSize: "48px",
                      fontFamily: "Instrument Serif",
                      lineHeight: 1.1,
                      color: "#1a1a18",
                    },
                    children: title,
                  },
                },
                {
                  type: "div",
                  props: {
                    style: {
                      marginTop: "24px",
                      borderLeft: "3px solid #8a8a82",
                      paddingLeft: "20px",
                      fontSize: "22px",
                      fontFamily: "Instrument Serif",
                      fontStyle: "italic",
                      lineHeight: 1.4,
                      color: "#4a4a44",
                    },
                    children: bottomLine,
                  },
                },
              ],
            },
          },
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
              },
              children: [
                {
                  type: "span",
                  props: {
                    style: {
                      fontSize: "24px",
                      fontFamily: "Instrument Serif",
                      fontStyle: "italic",
                      color: "#1a1a18",
                    },
                    children: "PhilOS",
                  },
                },
                {
                  type: "span",
                  props: {
                    style: {
                      fontSize: "13px",
                      color: "#8a8a82",
                    },
                    children: "structured judgment for things that are hard to think about",
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
