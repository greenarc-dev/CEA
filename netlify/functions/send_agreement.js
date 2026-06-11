const { Resend } = require("resend");
const chromium = require("@sparticuz/chromium");

exports.handler = async (event) => {

  const puppeteer =
    (await import("puppeteer-core")).default;

  try {

    const data = JSON.parse(event.body);

    const browser = await puppeteer.launch({
      args: [...chromium.args],
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: true
    });

    const page = await browser.newPage();

    await page.setContent(data.html, {
      waitUntil: "networkidle0"
    });

    await page.emulateMediaType("print");

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "15mm",
        right: "15mm",
        bottom: "15mm",
        left: "15mm"
      }
    });

    await browser.close();

    const resend = new Resend(
      process.env.RESEND_API_KEY
    );

    await resend.emails.send({
      from: "ceo@greenarchitects.in",
      to: [
        "ceo@greenarchitects.in",
        data.consultantData.email
      ],
      subject: "Consultant Engagement Agreement",
      html: `
        <h2>Consultant Agreement Submitted</h2>
        <p>Name: ${data.consultantData.name}</p>
        <p>Email: ${data.consultantData.email}</p>
      `,
      attachments: [
        {
          filename: "Consultant_Agreement.pdf",
          content: pdfBuffer.toString("base64")
        }
      ]
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true
      })
    };

  } catch (error) {

    console.error(error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message
      })
    };

  }

};