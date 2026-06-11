const { Resend } = require("resend");

exports.handler = async (event) => {

  try {

    const resend =
      new Resend(
        process.env.Resend
      );


    const data =
      JSON.parse(event.body);

      const consultantEmail =
data.consultantEmail;

    await resend.emails.send({

      from:
      "ceo@greenarchitects.in",

      to:[
   "ceo@greenarchitects.in",
   data.consultantData.email
] ,

      subject:
      "New Consultant Agreement - Green Architects",

      html: `

<h2>
New Consultant Agreement Submitted
</h2>

<table border="1" cellpadding="8">

<tr>
<td><strong>Name</strong></td>
<td>${data.consultantData.name}</td>
</tr>

<tr>
<td><strong>PAN</strong></td>
<td>${data.consultantData.pan}</td>
</tr>

<tr>
<td><strong>Mobile</strong></td>
<td>${data.consultantData.mobile}</td>
</tr>

<tr>
<td><strong>Email</strong></td>
<td>${data.consultantData.email}</td>
</tr>

</table>

<p>
PDF Agreement attached.
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