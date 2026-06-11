const { Resend } = require("resend");
const chromium = require("@sparticuz/chromium");

exports.handler = async (event) => {

  const puppeteer =
    (await import("puppeteer-core")).default;

  try {

    if (!event.body) {

  return {
    statusCode: 400,
    body: JSON.stringify({
      error: "No request body received"
    })
  };

}

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
      process.env.Resend
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
console.log("EVENT BODY:");
console.log(event.body);
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