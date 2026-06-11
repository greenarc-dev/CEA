const { Resend } = require("resend");

exports.handler = async (event) => {

  try {

    const resend =
      new Resend(
        process.env.RESEND_API_KEY
      );

    const data =
      JSON.parse(event.body);

    await resend.emails.send({

      from:
      "agreements@greenarchitects.in",

      to: [
        "info@greenarchitects.in"
      ],

      subject:
      "New Consultant Agreement",

      html: `
        <h2>New Agreement Submitted</h2>

        <p>
          Consultant:
          ${data.name}
        </p>

        <p>
          Email:
          ${data.email}
        </p>
      `,

      attachments: [

        {
          filename:
          "agreement.pdf",

          content:
          data.pdf
        }

      ]

    });

    return {

      statusCode: 200,

      body:
      JSON.stringify({
        success:true
      })

    };

  } catch(err){

    return {

      statusCode:500,

      body:
      JSON.stringify(err)

    };

  }

};