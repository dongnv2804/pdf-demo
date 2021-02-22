module.exports = (item, width, height) => {
  let html = "";
  if (item.length < 2) {
    html = renderHtml(item);
  } else {
    let current = 0;
    for (let index = 0; index < item.length / 2; index++) {
      html += renderHtml(item.slice(current, current + 2));
      current += 2;
    }
  }
  return `<body>
    <style>
    body {
      background-color: grey;
      margin: 0;
      font-size: 8px;
    }
    .container-pdf {
      width: ${width}px;
      height: ${height - 1}px;
      padding: 15px 10px;
      background-color: #fff;
    }
    .row {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
    }
    .title {
      border: 2px solid gray;
      text-align: center;
      background: #d1d1cf;
    }
    .title h1 {
      font-size: 1rem;
      margin: 0;
      color: black;
    }
    .info-left {
      position: relative;
      width: 60%;
    }
    .info-left div {
      border-bottom: 1px solid black;
    }
    .info-right {
      padding-left: 1rem;
      width: 40%;
    }
    .time {
      width: 80%;
    }
    .id-invoice span {
      width: 50%;
      text-align: right;
    }
    .qr {
      border: 1px solid gray;
      height: 30px;
      display: flex;
    }
    .qr div {
      width: 50%;
      border-right: 1px solid gray;
      height: 100%;
      display: flex;
      justify-content: center;
    }
    .qr div:last-child {
      border: none;
    }
    .total-head {
      position: absolute;
      bottom: 0;
    }
    .total-item {
      padding: 2px;
      text-align: right;
    }
    .wrap-item table {
      width: 100%;
      border-top: 1px solid grey;
      border-bottom: 1px solid grey;
      border-collapse: collapse;
      text-align: center;
    }
    .wrap-item table th,
    td {
      border-right: 1px solid grey;
      border-bottom: 1px solid grey;
    }
    .wrap-item table td {
      work-break: break-word;
    }
    .wrap-item table th:last-child,
    td:last-child {
      border-right: 0;
    }
    .label,
    .wrap-item table th {
      background-color: #d1d1cf;
    }
    .wrap-item table tr:nth-child(even) {
      background-color: #fff;
    }
    .wrap-item table tr:nth-child(odd) {
      background-color: #e6e3e3;
    }
    .tr-emplty {
      height: 1.2em;
    }
    .note {
      padding: 0.5rem 0rem;
    }
    .caculator-price {
      border: 1px solid grey;
    }
    .price-left {
      width: 60%;
      padding: 5px;
      border-right: 1px solid grey;
    }
    .price-right {
      width: 40%;
    }
    .col-6 {
      width: 50%;
    }
    .price-right .row {
      width: 100%;
      height: 33.33%;
    }
    .price-right .row div {
      border: 1px solid grey;
      padding: 2px;
    }
    .item-name {
      text-align: left;
      width: 45%;
      height: auto;
    }
    .item-name p {
      margin: 0;
      work-break: break-word;
    }
    .text-right {
      text-align: right;
    }
    .remarks {
      margin-top: 8px;
    }
    .remarks h5 {
      margin: 0;
    }
    .content-remarks {
      border: 1px solid grey;
      height: 4rem;
    }
    .sale {
        margin-left: 5px;
    }
    .td-amount {
      width: 10%;
    }
    .td-price {
      width: 15%;
    }
    .td-total {
      width: 20%;
    }
    .stamp {
      float: right;
      border: none !important;
      background: transparent !important;
      width: 70%;
      height: 100px;
      object-fit: fill;
    }
    .content-info {
      position: absolute;
      left: 0;
    }
    .wrap-right {
      position: relative;
      min-height: 100px;
    }
  </style>
  ${html}
  </body>`;
};

const renderDetail = (data) => {
  let detailt = "";
  data.map((item) => {
    detailt += `<tr>
      <td></td>
      <td class="item-name"><p>${item.name}</p></td>
      <td class="td-amount"></td>
      <td class="td-price"></td>
      <td class="td-total"></td>
      </tr>`;
  });
  return detailt;
};

// const renderTdEmpty = (length) => {
//   let str = "";
//   for (let index = 0; index < length; index++) {
//     str += `<tr class="tr-emplty">
//     <td></td>
//     <td></td>
//     <td></td>
//     <td></td>
//     <td></td>
//     </tr>`;
//   }
//   return str;
// };

const formatMoney = (money) => {
  let str = money.toString();
  return str
    .split("")
    .reverse()
    .reduce((acc, cur, i) => {
      return acc + (!(i % 3) ? "," + cur : cur);
    })
    .split("")
    .reverse()
    .join("");
};

const convertImgaeToBase64 = (src) => {
  return new Promise((resolve, reject) => {
    var img = new Image();
    img.src = src;
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = 100;
      canvas.height = 100;

      ctx.drawImage(img, 0, 0);
      resolve(
        canvas.toDataURL("image/png")
        // .replace(/^data:image\/(png|jpg);base64,/, "")
      );
    };
    img.onerror = (err) => reject(err);
  });
};

// {
//   `<img class="stamp" src=${convertImgaeToBase64("stamp.png")
//     .then((data) => {
//       console.log(data);
//       return data;
//     })
//     .catch((err) => {
//       return "";
//     })} alt="image" /> `;
// }

const renderHtml = (item) => {
  let renderDataTable = "";
  let totalItem = 0;
  let totalPrice = 0;
  let vat = 3000;

  item.map((value) => {
    totalItem += value.amount;
    totalPrice += value.price * value.amount;
    renderDataTable += `<tr>
    <td>${value.id}</td>
    <td class="item-name">${value.name}</td>
    <td class="td-amount">${formatMoney(value.amount)}</td>
    <td class="td-price">${formatMoney(value.price)}</td>
    <td class="td-total">${formatMoney(value.price * value.amount)}</td>
    </tr>
   ${renderDetail(value.details)}
    `;
  });
  return `
    <div class="container-pdf">
      <div class="header">
        <div class="title">
          <h1>Quotation</h1>
        </div>
        <div class="row">
          <div class="info-left">
            <div class="name-info"><span>Sasaki development</span></div>
            <div><span>Kimura</span><span>You</span></div>
            <div class="time">
              <span>Subject: Estimate for November</span>
            </div>
            <div class="total-head">
              <span>total amount : ${formatMoney(totalPrice + vat)}</span>
            </div>
          </div>
          <div class="info-right">
            <div class="row id-invoice">
              <span>No.</span>
              <span>0001</span>
            </div>
            <div class="text-right"><span>October 03, 2019</span></div>
            <div class="wrap-right">
            <div class="content-info">
            <div><span>Suzuki Shoji</span></div>
            <div>101-0021
            9-7-1 Akasaka, Minato-ku, Tokyo
            Tokyo Midtown
            TEL 03-1234-5678 FAX 03-1234-5678
            </div>
            <div>Sales<span class="sale">Yamada</span></div>
            </div>

            <img
      class="stamp"
      src=" data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD//gBVRmlsZSBzb3VyY2U6IGh0dHA6Ly9jb21tb25zLndpa2ltZWRpYS5vcmcvd2lraS9GaWxlOlBldGVyX0JlcmdfYnlfR2FnZV9Ta2lkbW9yZS5qcGf/4gxYSUNDX1BST0ZJTEUAAQEAAAxITGlubwIQAABtbnRyUkdCIFhZWiAHzgACAAkABgAxAABhY3NwTVNGVAAAAABJRUMgc1JHQgAAAAAAAAAAAAAAAAAA9tYAAQAAAADTLUhQICAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABFjcHJ0AAABUAAAADNkZXNjAAABhAAAAGx3dHB0AAAB8AAAABRia3B0AAACBAAAABRyWFlaAAACGAAAABRnWFlaAAACLAAAABRiWFlaAAACQAAAABRkbW5kAAACVAAAAHBkbWRkAAACxAAAAIh2dWVkAAADTAAAAIZ2aWV3AAAD1AAAACRsdW1pAAAD+AAAABRtZWFzAAAEDAAAACR0ZWNoAAAEMAAAAAxyVFJDAAAEPAAACAxnVFJDAAAEPAAACAxiVFJDAAAEPAAACAx0ZXh0AAAAAENvcHlyaWdodCAoYykgMTk5OCBIZXdsZXR0LVBhY2thcmQgQ29tcGFueQAAZGVzYwAAAAAAAAASc1JHQiBJRUM2MTk2Ni0yLjEAAAAAAAAAAAAAABJzUkdCIElFQzYxOTY2LTIuMQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWFlaIAAAAAAAAPNRAAEAAAABFsxYWVogAAAAAAAAAAAAAAAAAAAAAFhZWiAAAAAAAABvogAAOPUAAAOQWFlaIAAAAAAAAGKZAAC3hQAAGNpYWVogAAAAAAAAJKAAAA+EAAC2z2Rlc2MAAAAAAAAAFklFQyBodHRwOi8vd3d3LmllYy5jaAAAAAAAAAAAAAAAFklFQyBodHRwOi8vd3d3LmllYy5jaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABkZXNjAAAAAAAAAC5JRUMgNjE5NjYtMi4xIERlZmF1bHQgUkdCIGNvbG91ciBzcGFjZSAtIHNSR0IAAAAAAAAAAAAAAC5JRUMgNjE5NjYtMi4xIERlZmF1bHQgUkdCIGNvbG91ciBzcGFjZSAtIHNSR0IAAAAAAAAAAAAAAAAAAAAAAAAAAAAAZGVzYwAAAAAAAAAsUmVmZXJlbmNlIFZpZXdpbmcgQ29uZGl0aW9uIGluIElFQzYxOTY2LTIuMQAAAAAAAAAAAAAALFJlZmVyZW5jZSBWaWV3aW5nIENvbmRpdGlvbiBpbiBJRUM2MTk2Ni0yLjEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHZpZXcAAAAAABOk/gAUXy4AEM8UAAPtzAAEEwsAA1yeAAAAAVhZWiAAAAAAAEwJVgBQAAAAVx/nbWVhcwAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAo8AAAACc2lnIAAAAABDUlQgY3VydgAAAAAAAAQAAAAABQAKAA8AFAAZAB4AIwAoAC0AMgA3ADsAQABFAEoATwBUAFkAXgBjAGgAbQByAHcAfACBAIYAiwCQAJUAmgCfAKQAqQCuALIAtwC8AMEAxgDLANAA1QDbAOAA5QDrAPAA9gD7AQEBBwENARMBGQEfASUBKwEyATgBPgFFAUwBUgFZAWABZwFuAXUBfAGDAYsBkgGaAaEBqQGxAbkBwQHJAdEB2QHhAekB8gH6AgMCDAIUAh0CJgIvAjgCQQJLAlQCXQJnAnECegKEAo4CmAKiAqwCtgLBAssC1QLgAusC9QMAAwsDFgMhAy0DOANDA08DWgNmA3IDfgOKA5YDogOuA7oDxwPTA+AD7AP5BAYEEwQgBC0EOwRIBFUEYwRxBH4EjASaBKgEtgTEBNME4QTwBP4FDQUcBSsFOgVJBVgFZwV3BYYFlgWmBbUFxQXVBeUF9gYGBhYGJwY3BkgGWQZqBnsGjAadBq8GwAbRBuMG9QcHBxkHKwc9B08HYQd0B4YHmQesB78H0gflB/gICwgfCDIIRghaCG4IggiWCKoIvgjSCOcI+wkQCSUJOglPCWQJeQmPCaQJugnPCeUJ+woRCicKPQpUCmoKgQqYCq4KxQrcCvMLCwsiCzkLUQtpC4ALmAuwC8gL4Qv5DBIMKgxDDFwMdQyODKcMwAzZDPMNDQ0mDUANWg10DY4NqQ3DDd4N+A4TDi4OSQ5kDn8Omw62DtIO7g8JDyUPQQ9eD3oPlg+zD88P7BAJECYQQxBhEH4QmxC5ENcQ9RETETERTxFtEYwRqhHJEegSBxImEkUSZBKEEqMSwxLjEwMTIxNDE2MTgxOkE8UT5RQGFCcUSRRqFIsUrRTOFPAVEhU0FVYVeBWbFb0V4BYDFiYWSRZsFo8WshbWFvoXHRdBF2UXiReuF9IX9xgbGEAYZRiKGK8Y1Rj6GSAZRRlrGZEZtxndGgQaKhpRGncanhrFGuwbFBs7G2MbihuyG9ocAhwqHFIcexyjHMwc9R0eHUcdcB2ZHcMd7B4WHkAeah6UHr4e6R8THz4faR+UH78f6iAVIEEgbCCYIMQg8CEcIUghdSGhIc4h+yInIlUigiKvIt0jCiM4I2YjlCPCI/AkHyRNJHwkqyTaJQklOCVoJZclxyX3JicmVyaHJrcm6CcYJ0kneierJ9woDSg/KHEooijUKQYpOClrKZ0p0CoCKjUqaCqbKs8rAis2K2krnSvRLAUsOSxuLKIs1y0MLUEtdi2rLeEuFi5MLoIuty7uLyQvWi+RL8cv/jA1MGwwpDDbMRIxSjGCMbox8jIqMmMymzLUMw0zRjN/M7gz8TQrNGU0njTYNRM1TTWHNcI1/TY3NnI2rjbpNyQ3YDecN9c4FDhQOIw4yDkFOUI5fzm8Ofk6Njp0OrI67zstO2s7qjvoPCc8ZTykPOM9Ij1hPaE94D4gPmA+oD7gPyE/YT+iP+JAI0BkQKZA50EpQWpBrEHuQjBCckK1QvdDOkN9Q8BEA0RHRIpEzkUSRVVFmkXeRiJGZ0arRvBHNUd7R8BIBUhLSJFI10kdSWNJqUnwSjdKfUrESwxLU0uaS+JMKkxyTLpNAk1KTZNN3E4lTm5Ot08AT0lPk0/dUCdQcVC7UQZRUFGbUeZSMVJ8UsdTE1NfU6pT9lRCVI9U21UoVXVVwlYPVlxWqVb3V0RXklfgWC9YfVjLWRpZaVm4WgdaVlqmWvVbRVuVW+VcNVyGXNZdJ114XcleGl5sXr1fD19hX7NgBWBXYKpg/GFPYaJh9WJJYpxi8GNDY5dj62RAZJRk6WU9ZZJl52Y9ZpJm6Gc9Z5Nn6Wg/aJZo7GlDaZpp8WpIap9q92tPa6dr/2xXbK9tCG1gbbluEm5rbsRvHm94b9FwK3CGcOBxOnGVcfByS3KmcwFzXXO4dBR0cHTMdSh1hXXhdj52m3b4d1Z3s3gReG54zHkqeYl553pGeqV7BHtje8J8IXyBfOF9QX2hfgF+Yn7CfyN/hH/lgEeAqIEKgWuBzYIwgpKC9INXg7qEHYSAhOOFR4Wrhg6GcobXhzuHn4gEiGmIzokziZmJ/opkisqLMIuWi/yMY4zKjTGNmI3/jmaOzo82j56QBpBukNaRP5GokhGSepLjk02TtpQglIqU9JVflcmWNJaflwqXdZfgmEyYuJkkmZCZ/JpomtWbQpuvnByciZz3nWSd0p5Anq6fHZ+Ln/qgaaDYoUehtqImopajBqN2o+akVqTHpTilqaYapoum/adup+CoUqjEqTepqaocqo+rAqt1q+msXKzQrUStuK4trqGvFq+LsACwdbDqsWCx1rJLssKzOLOutCW0nLUTtYq2AbZ5tvC3aLfguFm40blKucK6O7q1uy67p7whvJu9Fb2Pvgq+hL7/v3q/9cBwwOzBZ8Hjwl/C28NYw9TEUcTOxUvFyMZGxsPHQce/yD3IvMk6ybnKOMq3yzbLtsw1zLXNNc21zjbOts83z7jQOdC60TzRvtI/0sHTRNPG1EnUy9VO1dHWVdbY11zX4Nhk2OjZbNnx2nba+9uA3AXcit0Q3ZbeHN6i3ynfr+A24L3hROHM4lPi2+Nj4+vkc+T85YTmDeaW5x/nqegy6LzpRunQ6lvq5etw6/vshu0R7ZzuKO6070DvzPBY8OXxcvH/8ozzGfOn9DT0wvVQ9d72bfb794r4Gfio+Tj5x/pX+uf7d/wH/Jj9Kf26/kv+3P9t////2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAEdANwDAREAAhEBAxEB/8QAHAAAAAcBAQAAAAAAAAAAAAAAAAECAwQFBgcI/8QAQBAAAgEDAgMFBQcDAgYBBQAAAQIDAAQRBSESMUEGEyJRYQcUMnGBIzORobHB0QhCUhXhJDRicvDxFkOCkqKy/8QAGgEAAgMBAQAAAAAAAAAAAAAAAAECAwQFBv/EADERAAICAQQBAwMCBQUBAQAAAAABAhEDBBIhMUETIlEFYYEycRQjQqGxkcHR4fAkM//aAAwDAQACEQMRAD8A8qUACgAUACgAUAHQAKACoAOgAUACgAqABQAdAC44mkJ4elJtIkouXRKOmXYi7zuSYzycfCfT51X60OrJ+hPuhQ0q6ZCyKGI3Kg7gUetHyP8Ah5+CJNDJC5SVGRh0IxVkZKStFcouLpjdMiFQAKAFxfeL86TGuybKPFUEWMQeVMQ29BETGPtRUvALsJ6SBjdSIiaADoAKgAUAHQAKABQAKABQAKABQAKAFRI0jhUUsSeQpN0NJvhF7pOhPKXku3a3VCuCVzuT/G9ZsmoS4jya8Wlb5lwWr6ZaxFozctK4OPCmByqhZZvmjU8MI8XZOmihWyFpDlIuIF8nlsD+WahFty3MlNJR2RI0tqtowkKgqyh17o5xv/FWKW7grcNvIzqNkJLV5bhhIoIEZI38+dPHKn7eCOSN/q5M1PaBnbgGGAJKg8/lWpT+THLHb4INWlIVAC4/jX50Ma7J0vxfSqyxjR2WmIQaZETFvIKH0C7CemhDdMQmgA6ACoAOgAUACgAUACgAUACgAUALjjLuANyfKk3Q0rdF9pVg3GAqtnzA5Vly5DdhxPwaJSyKsdxxO6ENz6DNZ412jTK+mNwWk7SCVhwJxZyeR9PlRLJHpDjjl2yb7lI8zMVIQkjaoKVIlKDsnizdY4Y2hwM8LMBgkHzpOY1jGLy2f3aSW1MQWJjlJd88tgKcWvPkUk2rj4KG/t4WfvJmEUzZ7zbkccq0JvpGaUebZmb62AbiUEHzxsa0wkZJw+CAy4q0oYE+IfOgET5eY+VVotY02eGmIQ1MixMX3opsF2E9CBjZpkQqACoAFAAoAOgAUACgAUACgAUAADPKgC1sIe7AJOGJ5YyTVE5WasUK5NPoenG5K8McveSEKi95lifPFY8mSuLN+LFav5O4dkPZvCYYveyokdeIjPKuPm1blJqJ1YYI4obpIuJ/ZrBMzmNuEE7LyHzqqGpkiUvTorn7BS2dwgUK0a7edXrUX2Q9FPont2SeWApJGFIGy42qPqOyxY1RkO0vZOWyBmhjbiGRt1J6+lacWW+GZ8mLyjnuo3CrJ3N3CplUhDnz671shHymYsj8SRn7m1glZ1LlJC2OHBPCPnWmLaMcopmavrV4Z2V1Ksd8HyrVGSaMc40yIvxCplZNlO4+VVosYg/DTAQfhpiCh+9FD6EuxMnOhAxs0yImmAdAAoAKgA6ABQAKABQAKABQBa6ZZqrLLc4xzC5qjLN9RNOHGv1SNAkkUXD3aR+LcEKSxrG4t9m9SjHpHQPZ9AFvklmUZUEqcjP5Vg1UvbSOlpIXK2dj0i/AcHvolYDA43IH48q5LTOpNJqi9stXm42jKQ56ETA5+lOJmnp4vnkle8cZ+1HC/ketXJEdldEqBFldVznJwKuhG2UzbirH9U0i2ns+FmB2zg+lWvEkrRnx55OVSRzftD7PNMvZTKqKHbPLbB86I5pR8mh4Yz8HC/aF2Wl7NaovM28nJmOcmulp83qKn2czVYPTdroyGsSyTW4ExCsBnDDcjoQa1wST4MGV2uTOda0mVk1xkKfSoFjEHlQIbPKmIKH70UMUewpOZoQMbqQhFAg6ACoAOgAUACgAUACgAUAOW6l5kUcycClJ0iUVbRfQARHACkAcyKyS9xvhUeETIrlmU90q8tyQMkelVuCXZYpt/pOj9g1wokwNhjJ2/SuZq/g7GjVKzfW1zLAhkillQY+IKGUemKw7U+DoOXAqO5kuHWX3e3uOE7tbjgcf/btV0YJcFe41FjqHHbhY52UrsVmGQPQ9RTq+yDrstba/KhWeN4/Jk8aH5EUJU7IySlwWKahFcFe6nRiOanapNlKxNXwRLyQBck48vKqGzRCJgPaTpcGu9mL+DhX3hIzLC+NwyjOPrjFX6bI4ZEyjVYvUxteTzRfSmTToFkLEYJQnkB5V6CC54PNzftSZRSr4hyH1q9MzNEpvgT5VAkJPKmFDT8qYmFD96KGKPYJPiNCBjRqQhFAg6ABQAKABQAKABQAKABQBN0pXN0DGASOhGary1XJdhTcuC0kVl4hICCemOVUKn0ammuxClwUUbsTjFS4IW+jtPZGwaHT4kyAQmWY8q4WpmnI9LpYbYJGt0XU9MWVojesZF2KoBz9c1TslV0XPJHqzY2cNjeqCQjFvhlUAH8RSUWKT8xLGTSI3X7dQ2PglQ4YVYk0Veon12QP9Ilt3Y27vwt/fA/dt9VOxp35GpfIqeLUYl4uCO6Uc+8AR/wCDUeCSkinvJplUrLFLAH5oxyh/io8E+SrvJDGVRhgYOVLZ5jz8qIx54ISfHJ5s1a3xa3EaKSsMxYEDOFJ2P816LHLlfc8vkXDXwZhj4sitKMbJh3hj+VQLPCEt8NMQ01MVAh+9FD6Euwn5mhANGpERNAAoAFAAoAFAAoAFAAoAFAF92NgW61yCBh4DxO3qFUn9qzap7cbZv+nQ9TPGDNHeaLcRwiWZc4bBzyz1rJHKrpHU1Gl5tEXR9Na41qGLh5Pk+u9WZMm2DZix4nLKonXrmcaXp2y5LjljmBXGjH1JWegnLYqRh7q8muZ+NY0tWz4WMoQn6da6Cil9zBNt8of0ntVqWj3XdmdjETkhtwacsKkrRGGaUHTOu9l+2D3kQVmHAefEc1inBxNqamrNFDq4jwQ4aMnlncVXRZS6Zaw6lZ3EIzw5OwPrRSfghsknwyt1SNEDOmRjlvkVBxLbbXJy/tnqfuNneTcQ41Uou/Jj5VpwQ3ySMepybMbZxK81FjdZQDBTh/nNdqMODz8p8mcnUCRsbCr4mWSJKfcJ8qj5JLoSfhpgNNzpiYIvvRQxLsKTmd6EDGqkIRQIOgAUACgAUACgAUAHQAKANb7McHtZbxAAtJHKN+v2bbVj1v8A+Tb+x0/pL/8Apivm/wDB1TU9PfUkjsccKLF3khPmd/zJrmQlte49FmjuVFX2P0wJ2mvQw8Nu3ApO9LU5LxqvJl0mLbmk34Ok3Wkx39n4t+Ebb8qwY5uL4Ohkin2cx7T9jpblnLQSbnIePcj8a6mn1SgcvV6P1VwV0XZtkSGBDJ4Rh+LJyfl0q+WZPkpx6VwVN2dR9k+gIkt5DKHeBQvCX5jNYc89zRtwx2RZS+2XXV7L6xa2Fi7d5JEZWGdlGcftVmlw+om2V6nVLHXyznkHbXVxJ38Msp4d9uQ9TWz+HilRkWsk+UarQe3faC8JWXEi4yS+Nx51Rk08Il2PUZJPkzXtQ1J2lsLfj+8Qzvj8B+9XaOC5Zl+oZXaj+TnsrsCTkGt6RymyNI2c+VSRBkmL/l1zUX2SXQR5UxDL86YmCL7wUMS7CkO5oQMaqRETQAKABQAKABQAKADoAFAAoA0HYS4Fj2msLxjgQyjbzB2P5E1m1S3Y3FG3QT9PPGb8M9I3f+nRKO5LtKB94BuwB2X5bV5+O9nsppKzO6Cgg9+vDw/bSlhinld1Ey4Ftt/c0Wjaoxl7spxIajsrkvvcaO50kXUKzIzRkjcfxQpUQcOaKrUYoNOxHFEnGwyzNzqW5sjsX7mk7DWT21tPcXI8TjvCo/IUR9zvwiGZUlFdsx/bbsVadtGF1cAi/gZwD/km230x+dW4M88XXkr1OlhkptdcGGh9lMkN3JNpdzIHHIZBKH5Egmtb11rbNGGP01QlujIg3nYfW9O1xbiYx8Eih5FgXhA23JA2BPX1pfxMJR2k3ppxluTMN7SZA/amWNTlYIY4h6eHJ/WtukX8tP5OZr3/ADq+EjNSgcClQAcAEDzrQjJKvBEl24QOozU0VSJUB/4YfOovskug+maAGW5mmISn3ooEuwSc6AY1TIiaYAoAFAAoAFAAoAFAB0ACgCx0twHMUajvJBgu3JR1qnJ8s0YHztj2zo+k9rrhoodPZGluDiJJh1HLJHnXNngXMz0OLXe305K30biR2t7JkZd2cj6DYflWBLdK0a4vahvTbowyKeIYzy9KtkizHJ2be27QiK3CswO2AoO5+VVbXZY2qtmM7RdprSwunuNRuAJmdUjQb8PrVsMMp8RRnlmhjjumzU6H7QLKG2KTXMcZiGHLkYJPr1p+lKPSG5wn+on6Rq3vF6TGwAZBKhHkdqpnGkXRe5v7l3LpccrGdnABOT03qG50RpJ0ik7SXtvYafcMsmSqE8RO4GKIRc2kiE/Ym2eXb1J9S1e6nKcbyMZCAeXEdv2r0CqEEjzO2WbI512U120aySKmSucLV0UzNkcU3RBzVhQTrf8A5b61B9li6D24TQOhg86ZEJPvBQJdiXxmmgYimITQIFAAoAFAAoAFAB0ACgAUAWOjRo9z9q4C8scyfQCqczajwaNPFSlyzb9lLAXevr0hhVpS3PcbD9a52ae3H9zsabHuyX4Ru72fvITjIx686xwjR0ZyvoqtOncW8zy7AOR9KumueCnHNpNsnWmphQxTxyYxudk+XrT2fIetbKLXL9ihe4ghbh5GRATv5Gr8cbfBTmyuuUZO503Ur9lW2QtCzAlyeEDPLNaVOEOzDNZMjpdHZNOMug6Vo8k0oncAwtIAQGB3A38sGuXkqcnR3sb21bNU/aNBacLHmPOs+xsvckuTnPa7UHuIJ4FZm7092ig4JLHArZp4U0zl6vI5RcV54MBq+hXOgaYbjU27meYmOOHO7MN2PyA/Mit0MiyyqPgw5sT02K5Pl8GDJJ5/OtxxQqAJtuf+GPzqD7Jx6DGymgYwSM0yIEOZRQC7EPnNNCYmmITQAKABQAKABQAdAAoAFAAoAtezWk6nrerR2eiWstzdsC3Cm3Co5sxOygeZqvI4qNy6LMSk5JQ7OudldB1DR7fVH1L3YyyRqsawSBwAAcjPnnFcTU5ISlFRPT6LBkhGbyfihqK57+IovTceeP4qzbTsgp7uBrUlZdLkjtVBldgqIvnnJpx/VyRlxjpdmVupte7OzICkc0Mnj8AJKnyJrXGOPKvgxylm01SauLJum9vI47pGvrWKYA7xzxhl+tKWlde1l+PX4796NGe2OiahM8ht0sOPYNEMxhvMjpVDwZIl7z4Jv28D932qtb6xubB5OJomDRkcsgjBB9f3qHoyTUiK1Cft+CgftDL/AK2tsmXQYDBd/pVqwrZuK5apue0tLbXdFs9eSbXWCiFDKiY4sNnY48x0qPo5HH2Eo58KneV1RhPaX2ubtb2ia7hVo7KBBDbRsMEKOZPqTW7TYPShT7ORrtT/ABGS4/pXRkK0mIFAEy2/5dvnUH2WLoVvg5oAYx4jTIiovvl+dD6GuxEvxGhCY3t1qQhNAgUACgAUACgA6ABQAKADFAz1f/TT2Su4vZnPq2npCt1rM8sckpx3ncR+BUUnYePvCfPC+VcvXSm5VHwdL6e8MHvzfgo7PSrnQNGisNQR0vIncSiT4s8Z5+e2DmuXkl6mVnp8SSxpp3Zh4E931Ka3kJCF8r5EHpW690Uzl7duRxfRptOskbDLgmM5H6VVuNMYIVqVnHcOoZcEbkeYqcJ0NfBBn7Etq5PdiAxkcKPIwG5/ywP96uWbb0UP6esnMeCub2KTqxN1r1nGWPgigRpcDzJOMVc9ZXgzr6PduUv7f+/wQbPsVJol8RqE4ljh34kBwx6Cqp6n1F7ULHpPSdyfRXmO20iaW4mde9di7ny3zip85PauipqOG5Mw+p3fvlzNcMPvG4l35DyrdCO1JHKyZN7cmQDVhSFQAKAJlnvE9Ql2WR6F9DQAyedMiCL71aBrsbfnTQmI2piE0CBQAKABQAdAAoAFAEyy026veEwREoTjjbZfxqEskY9k4Y5T6L+27PwWUXf6g/fNjKxgEL8z1Iqh5nJ1E0LCoK5nsv2NXkVl7NtE7wRQafaaSL6ZwMBeN3c/gAT9ax5JVNrsvcF6aku5Ol/ojil7r1xrsP8Aql0SZbuR5yD/AGhmJA+ikD6VjlDbkZ6LC0sMUukYrX3K3SXCb8OOIema1YVxtMGplUtyNP2P1OK4n7qchQVIyT+FVZcdcl2DKpcHSV7N2GpWscqTPEzLkMozjzqmMmmavTvlFBP2G1WCZptMnR1U7skvDn5jrV29NclOycHwydp+j6pGO+vY2WQnhjVmJBPnv0FVSkukWXJ9mB9pWrwQXXcwyF4bbKceN5JOrfIVfpsblyYtXlUPwcY1TUJLyRssSpO/rXXhBRR5/Llc2V9WFIRoAFAAoAmWX3clQl2Tj0OH4eVBIYbOaCLBF96tHgF2Il+I00JjZqQhNAgUACgA6AHba2nuW4beGSU9eBc4pOSj2xqLfReWnZO+lIM5SBev9xH4bfnVMtRFdF8dPJ98F9YdmbG14GuQZXPIucg/T/3WeWecui+OnjHvkmM7SxuuUigjY4CbHHpUar7snd8eCv1SfLDB8B8OCM7VbjjwVZZfB2d9cktv6YrqaKY942mQ6cqq2PiuGjbI8+FD9DVW289f++S1yrTpr7/8f7mHsLgSaVbGP4GjVh+FZpxqbO3hmpY1RWapGGjKvkggg1OHZRmja5Krs/Dqk+sQWGkWs93ek4ihiXLMOuegA6k4Aq+e2rkYYuUJUj0Z2Y7H64kMf+o6taW1xzEMatNwk9C4wp+maxOG58G6OvUF1ZJ1+TVuylo17qkcNzpwODdQZ4UJ5Bwd05jntvzqPpSNWLXYsvHTOfdsvaZmw91sygupEKA8W0YPNj61Zj0zk7fRnz6uEf0dnGtcgvL6zicyAvJllXlxLyroYtsW6OPqd8kr8mQkRo3ZJFKupwVIwRWowdcMSaYgqABQAKAJlj8L1CROAs8sUiQyw3qREOL71aH0C7ES8zQhMa+tMQmmIFAFjo+j3urSlLOIlV+ORtkT5moTyRh2ThCU+ja6b2ItbYCS+lNxIP7OEqn8mss9Q31wao6ZLmRpIrKC3gWO3VFVRlVQYH1FUW27ZoUUuENzwlVYoTuuwXlk8qErBvgrrmUwsyToFlIAGDsB6VYo2uCtzoo9UkZGCudm5Z6+tXwSKZtjGoyAwIwzkDO+9OApvg2FtqXvHsI1ewBJNpqluMeSu7MPz4qhKNZk/lElK8Dj8Mq+xV13ulmFjk27FB/2ncfvVGqjU7+TpfTsm7Ht+C1u48ttv51RFnQmrOjezhI9F7KtfRd1HLqE7ieU7N3abKmfLOTjqT6VJ+5nNzupbToCjUb2zF1HPYWVjjAmupxGp8zuBkfSrIQT6McptfuSrlorPTJ7W1uh2hmvI2t5LOMGONo2BBLSHPCpzuwGc4HSrJQXRWpM8iR6DexdprnSL1GjltbhoZQ2cjhOOoBIxjmBVs8ijGy7Bhllkl4LDXZVXtCbZCFWC2RcepJP8VVp1cLfllmvdZNq8JEKfT7XVBw3B4Zv7ZR/5vV1uPRipT4ZmdV0S60/xMBLD0kQHH1HSrY5FIqljceSqNWFYKABQBLsf7x6VCROA42MUDGXFMi0KhH2o3pPoa7G5c5poTG8UxUIAyQACSeQpiNp2Y7FzXgW51PMUGfDCdmf5noKzZc6XETTi0+7mR0CKO2tIFiitlt41B4QBhR+H71jbbds2JJKqHnjBtkeIjiHXizmgfi0MGWJ0YFWR0GMJ5/tUlEi2vJCvlHCCj4WQADO/wBKtiiuTKWQLOoQHEwJG++atquSlMqNVRlQcThiMZx8qlAjP5GrkE268WCCMDB5UR7B9If7OtdXlhrOj2ql2vbYTJGP7ngbvBgdTw94PrTnSqT8f7hjTdwXn/YR2MvUttUMUhxHcpgHOPEOVV6mDlG14NH0/KoZNr6Zspjw+eRsRWBI73Qv/WjBposrkn3RH414Bhsn67dd+dX44qRy9anCW5dM0vZTtJYn/hrOxUmQYkkkzKzjmFYuW22Hh2U7Z2rQ4/JzrNfL2r0rRbdtRvtTjljiYObe0zPJtzyQvCpPmSM5JyPhEdrk6Jt0rOfwXcOra/e6p3XdveSyXKqcZAJzjbbOMVhyt8noNLBRjH9jnXaAk9sNSbYqXFvjPVUGPzFbtO6xxRydZHdlyP8AH+iHLYngHAT0z5+dXNGBdE6K4KMUdcoQdjyquUSyMis1Ps5aXkPfWDiC5O/dn4H+XlTWSUXT6FLFGXK4ZkL6yuLGcxXUTRuPPkfketaIyUlaM8ouLpkemRJdid3+VRkTgONyqIxpqkJhxfefSkwXYiU700JjVMR0fsl2ci0+1ivrxeO7cZ4GUERj+axZszk9q6NuHDtW59mnFy5ZlUhVVc8K8wMVUkX2ELyIs6uF4gMggciPPzpqJHcMOnAsr27gk5LKPhYfL+KkueyLfwMBjKOKLiSVAOMAjz5etTqituxIl4+ONmJY+e2+dgMU6oLvggXcWHBUEbEMp5b9RU0yDKzU0JhkZAWUEHzI+dOJGXKISBZrMrkhgTgCpdMS5iDsfqS6N2q0fUJN4re6jaRfOMnhcf8A4k1KS3RaIwk4SUl4NX7WewN12YEWswrxWE9y8LFMYjfOVIxyDAfiD5iqcE21tZp1kY7vUx+f8lRouse+BIbhh36jY/5/71Tmw7eY9G7S6v1PZN8/5JGpMBuSMHbFVw46NWdKUaZT3d1OHjnmuLS2t1yFXh4mfh6BBsM/StsIo4WZtOvgmWvam9vrDUdOv2ebTroLN7lG/cxF05E43x6CpbUuSrcy39n9wLuwiVRwPBMYwoJOB0H4GsGrjUn9zv8A03JvxJeVwUmrwre9qNSa2wxa+znGQAvxb8tyDVuKW3HG/gozQ35ZtfI3bluBMLhTknzPrWk5S+xL7kumGwQCDgdBjrSQ2TtPhZIzIyngxyyMDJ22quT5onBUrJElrDeWxgu4lljPIP5eYPQ7VF8O0S/UqZj9b7JT2/FPpwaa358B+Nf5/WroZk+JFM8LXMSgsgRI4OQQNwatkVw7HG51FDG32piYIj49vKhguxtzvTExvNMR2OWRiqtGT/1Nkb/L9K5iVHTk7IsMgFxIcs3FuSfyqxLgrb5EXEgIPiAY524cDh/8zU0iDZA9+ls3BbIQjxem+2PzqzamV7miZcNgRXlue8hPxDzPUYpK+mNv+pDJlZeC4hywbkOVOvDE35QqRmukWUeJkGGA6etCVcD7RGCCWEgKzbHA89ufrTumJ8lTp6M6TIufBvk/xUpdojHyirKh0cbY3G3lUytnrbs7FYe0P2TWmm3s0Pf6lpoWQFhxxyxng7zHPAdQc+tZJeydo2R90LfR5JvLO60y+ubG9Rory0laCVDzV1OD+la07VoyVtdMtrO4kuoe7vXyoGz9fTPnVMsSTuJthq5NbcnK/uV+s2/dwtllOcOpznONj+1ShfkozOMnaIFjN3bxvxY4Tg/KrTOuDZ+z+31V7+/h0XTry+trkqvvEELcEeDv4sYBKkjnzrJqdjS3PleDqfTZZIyaiuH5+Dv/AG5tLTs37OLmystKRLO9ZZAFIYaeVPFwggnPFjHFtuT51lUlJ8PlnQhF7rfCin+eO/x+Tz3aKWiQlMZUYH05V0ZHAiPXJUQkg/CPxpIb+5NgmT3ZFRsEqOmw/wDBVVNuy3xQ8QHkGF4sZ3B5UAPxSLG+SBwgY3GcZ5etQavgmmkVWqaNa6iDLgQTg8Per1+fnU1JxIOKkYzU9MudPb7dPAThZF3U/Wr4yUuimUXErZOlTK2Kixx/SkxoblG9NEWNVIR1Sa5dJWDkhmOCSM/QelYFHg6EnRDll8SMFAY7+LkRViiVbvILr7W2EkK8JXPFg5ANSX3INjKuLy34X32wSCTk/tUuiN2Q9KvGtbqWxu8BGyBxdD51Jq+UKL2umWkbNDMYcsBgNGBvUe+SXQ1ayOk7ozMFIwQDtmhq0JcMkxEcuQzs3IZ61F9kvBS6YeG+uVB5enM1Y+kQXbIDRFZ5QP7nY/nTRE6P7Kdag0K1fU1tpLvVdLuxDDD3pRDBcI3EWABJw6bdMsM1nzuqfydLQQ9VSxfn7mi/qG7NW011ofbXRY2Wx1yAR3Ktz94Rcgk8ssoI+cfrVkGtqroy6jFLFklCXa/8jksbRqQJ1MbY2B2FTKOg5rY3dlcyxlClpH3r78kJCnH45+lQlNRaT8ui2GOU1Jx/pVv9jdexv2eaZc3MGo9roxNDJ4oLRjhMdGk889F5edYtTq5OWzH47Z09J9OSh6mTlvpHo661nRdKtFh94gSBFwsUWFVR5ADasXBshhySdpUZzUO0Wm67ZXOkv4rK7QxvnbKnqKak1VF7wR88s8+6/o112e1qfTbhyQniikIx30Z+Fh+/qDXWxZFljuPOZ8LwT2P8FXfg9w+AcDYseQH/ALq1FLJFjnu0KlVDNseX1NQLLJMMi4PGOLJI3ON6TQkHHLJh/iYcsnzzSpWSvgTxlIt2znc59adW7FZIuY+9hIm4HidcFXGc/MVWvsTZhO0mjDTpe9tn7y1ZseqHyPp61ohO+GZ8kFHop4fvPpU2QQiQb00JjJ59aYjospZiGOQuQPmR1rJFGyRHlOQVYkqDkeHcVYkVv4EaPOI7sxSOCGyADkAfOpNcEUxi4Mmn37RDwqxGx/I01yhPhj+s2xvbZJ4GLzRrxKcbsBzpLhg1aF290bvTIZgAZYTnfqvWnVMLtC5ZeC+jcHJfxA+ZpJeAZJiIF1MWI4QARvketJkk+yq0hMazcAniGcHPPBqT6IrseSPFwSigsCxyR60eANJ2P1eDs9rtzJcANa6lp89jJxL8MvDxwv8AMSIu/rVeVKWOSaNWinLHqMcouuT0NqWsaH7SvZbeaPbLb6fqMEIktYdkjE0Y4l7snAwcFd+QY86hDNBx29UadVoM0MnqXvUvPn8nlyV++gB5BuYIG2enzq5HNJPZ+KyGtQJdKI4JH4LjGysnkR5H96q1Cbxuu/Bq0c1DMr6fD/Y0uvdqANQ9w0SM3M0zcMMMXn8+g9aw4sHFy4O3k1SjJRjzL4Oj9kvZ/wD6po/f6rrlwb4+GRLYIqKfIAgk/M8/KqW1J+3otlkljpT5NHD7Oo7NlkivbtioAHGFbaq5KQo6qD4ob9oHYgdptBVIFT/UrUcVtJJhT6rnyP61dgnLHK/HkzamEM0XF9+H9zzt2m0nUNBk921W1ls5yAQknVc8weTfSurjmpq0zh5cU8TqSGrYt3IwM4A6E9aEJjiOwjOQoOAQSP2NFfAgWzOschkbhBzhc5/9UvI+kCHeSPYEE5OedN9Cj2C/vD3giiJLMAAo3GB1pRj5Y3LmkQL2A3GlXMWchhkEbksN6n5IdoxkGS/0NTZWuxEnOmDGsUyJulaQHkVO+Cazo0sKJ2YP3nxkeEdKlRAr7pZIn4+bLtjyqZElXD+/6asij7aIcLAeXnS6YdoTpl4xjSKTbgOVzyFNoSY5BH7nqUkIBW1ulLpvjHmKXaH0w7n7NrUBcNgqD0AzQgfA9bOGurlu8yAAm3njpQNdjNiSur3UgJAUgcs9P5ofQLsmHxxBnV+Bmyux5+nlSAavohPpsph4uJd19CNxR55Dxx2dk9imlr2stO4sLi3jlhRJZBIx4grbEgDngjHzIrnSwzc2j089Zix4YZHfK/uc47Xaaundob+0jx3QlOAu/C2SGX6EGteCe6Cb7Rxddh9LK66fK/JT20Es8sMNshknlcRoAdyScAfWrZSUU5PpGWEHOSjHls7N2S7L6doFjcRyCN72cD3if+4nbwqeijH151x8maWeV+PB6LDp46eNLl+WXXZdLq51OdNGvY4IUbxNKC/Ef+lfTzpPukaFW3dLk6FYpeRxfbXjTn0jCg1GpGeey+h9TKCcsc+Z2xQtxFqLOY/1B6LLf9iffo4u8k0+4SYsPiSM7MfluD9K16aUo5OenwZ9XFTwtLtc/wDP9jg8TYAAcdBseddBI47ClycgsfCMnP6UCI6yZil4C2eueQ5U/wBxNjsc3dwmV2DcYPXxYHlSathdckbxvh85c55jkKkIfXLhhkkKeEED8TSHdmRu4DbajPFyAJK/I8qndoguyG+QTvTRFjW9MRtLohAQuWPCAfFk5xzqlIvY3nxcRJIAx4uZFSIi7iMy23Hw9d2BztQhclbazvp90rNuvI532qXYrokXaokiTQZMMm6kfpSXwD+UOhxNaMysA8J7wH9R+H6UMBF26gpLkeFmBYb52BoBkmxyYEVz4nfib6nJpMaJGnjiSe4P/wBSUsBxb9QD68qT+Br5JMpBRRwHu/iHi648qSGHGFWPDIeHkD5A/wDmKbBFt7F+0A7M9ubU3ErRRFns5H4uEKkowrH0DcJ+WaryL3WvJv00lPC8b/pd/guPbHZCw7e3p95hulu40umeJHCcTDDAZ55K5yOec7VHHxKieqi54FOv0mR025kstQt54mVXhbiB54qWWKnBxMemn6eWMvhm60vXLrW9Q4J8xW8aguyn/wDX5mufKKhE7qm5ui2bXZtE1CI22CfhWMkjiHkANyahGF8stWWvadb0O91G/wBOgmDWkXeKCV8TEHy22qDvwE4Qi7kmyxzdhvHNbeRI4v0qPuI1DwmRu0Ngmq9n9R03i3uIHTONgSpAPyqxWuSNN9+eDyRcW0lk7293GUuLdzHIpPVdq68ZKSteTzs4ODcJdoiXZyhdgcNttUiIy7EwwxYwS25G+w86CLFySGTOd8jC+WPT50DFM+MIvEWboTQBJjBRQofpjGN80hmf7QKBqQcDHFH+9SXRHyUjnJNSRBjdMRtI+GWKQghWG3CTvmqkXMiSxEq3LOOY86kRFWNynEyNtk755H6UNCTH720E5CKBx7lW6GkiTRCsJEAa0umxGx5kfCehFN/JFfAiwlNveSW8uOEnhIHUHrQ+ULpjaNxhY3BOJCx8tuVMf2J/vBjiYrkyN4EHXfrSodk+0QKEjQEYX4cYGAOe/XnUWNEiTgaNc8XBzJ/agfgVFnhchSNgSR1FAclYZotP7T2Nzc26XMAljklgf4ZVVgSh9DjH1oatFuCbhk/fg6t227c6FrWhXumaSbmRb27S6jF4hV7IJkAKeIgjhwuBgDPkAKzybjz8HVxY1kW2XlNf6/8AZzCV24yjEZTnjO9aPBxWnF0+0aHSdbXTtFcrFxSu7ElepOwrDkx/zK8Hbw57xKXk0mnrDp1kLy9mSTUJUy0hOe7H+K+X71S7k6XRojUVcuw9K9qttoayQ3V33gX7uOOPJPzbO1WrTSa9qK567HHiTNBpntosNRJDx9yx6Nv+dRlppRDHqsc+iZqntABiXupfCx+EHpSjAm8qOS9rphNrk9wR9+BLg7ZyN/0rdhdwONrE/VbfkzlycxqCRgdAdhVxkYjjMjoi5OBwj96OgsJZgrlmVWA2B5ZPoPKgOiTGeF3kc5JHlnHkKQx9fCxMwbHMYzkUB0U2vsZLqKTGAUYAemaF0LzZQyczUyLGqZE0sc3c3ByCFzVfgtfDLNUWRFMZ3J2HFvmgEQNQtDgPEftBzpoTQmz1RljWGU7g9aGhKXgTqMTuvvKsrPnf+aF8Da4IhcmL3nJ7yHZvMjofoaZERASkQJJMj4Gc9aBIn2rZZGYDgTZTy3oZJFta4Eg4jgHoeRFRZJcDrJFGmFJBIH/bikN8DsZKsVKtknI4fxz+tAdFV2hiYxRPnJRt/rTiKXHRsfZw+n3eia/ZX80cMtzb4tiSimRmGAv+TYcKQq536Vnmjs4ZXUl5MzOskfo4BLA7HPUYx5jrVmN3Ew63H6eV155I0GqW8V5DDdo3dROTxKc78xkeWaU8TdtCw6lQShJdEHtDrk90GW2kZYc4JB508WJR/UGp1TnxEzTK/wATA79TWkwF52URZr3DEqI1LDAB3ztsaozcI2aTmR3nsnp8Wv6MDexwxPDtGYwAWx1Nc2dxfB241JJszPtJ073QWFwqARgtAxPTqMn8au0s1bizH9Rx8Rmv2Of3I4pVAyATgb5rechkN5+GYh8sx8IRObY+VFCsejSTvMyfaSZ8MSb8NA6HkljiYSXJ4mJxwKcmkA7GZZXDSDgGcquKGPkg9oFw0BzuQ2RQgM8/M1MrY0aYjaX9gLhXe25j+3ngfvVSdFrVlbb3L2s3C6+HONxyqVEbLR7mOVF7tsyEYJx+dKiVorruzWdQYxwSgciedNMiyEl3LC3dz8RC7c6dWK6E3A7uMCLJjmyoPl50IGKhTjfnhV2z60ATUcEBFwAOfM7UDLOEAxoA25O+3MVEkPl2HhCMOHfHMg+dABpJ3rAOpDLk4HI/vQAnUohLbuEO5zgYz6g/OkgZO9leuJovaewmunWO04zBcMTjEb8zkAkYYA5AztVeSPN/J0NJlbx7fKH+38Ii1+/mS2uYILlzeW6XELxMUfmQGAJHFnBwM+VRxOnRZrY7sSn5RgpsPxEnJPWtRyBCW8j2s8nDmNSqM3kxyR+hpPsaVpjdtbSXUPCgGx5k4psiiw02ObSNXe3u1CSMvQ5B6jBqvIt0TRp5bZUdC7K9qhp90IWdRG3PNZJ4m1Z04ahJ0bbWNOTtloV5YJNwPKvHE56Ou4P7fWsql6UlI2OCz43B+TifZ3TdQ1GWG3srO8urhGfvEVhwyFVZuEHp4UbJ9K6jklz4Z57a+n2rIls8KKXiyockqqHifhJ5FiNvpVjRUnwSkeeUBY4RFGM/CN/xpcIkSrW0ZMluJpTsTjOKTYJDvvCxR8CsrPnBUDbFFBZVa+xDwoSOLhLEDpmhAygfmamiA3TEa2C4kt22Pw8x6iq6LLJd2lpexMccMy7MRypK0NuylaOW0mJ5qTjPnUuyPRMDi5AZSA45dMmjoFyRJkS4UpNsR/fQBFd3t4JLeQfC6kevqKfYuuB3i7qNVUZ4tz+5oAdhYDcEZ6bUAmWfecEIPh4WGNuY9KiSscJMhGQ4blk9aAHoRmXiYEYIJC/LnQNDsXArHIbLDfrSGUk0LW18U3RZSQpOxHUUT5jfwXaWW3Il8nUvaDe//J+xWjdoSY3uoQLe5KcXGqsOHxk5G0ijHiz4jsOdULiR0JK4OBx2ReFipByBuK1nFarhnROzugLJ7MNbnlVuKW0lvUYDYGKVAv8A/L/jVLfvNEY1ibOd2EiQXUiu2I2B3zVvaM3ksNavrXUTZPbsTcxrwOcHBxy3pVSZOLtqiI7nvQWHCAeflUUaHd8nb/ZjexyxRom7kbFuVc3PGmdrSyTic11u4TS31xDdoLtrpIozC/CMlmMhXpw4xknzxW7Cm4o42scfUaQ1qVjFphY3EsT3TSESww5yjcIO+RjfJxwk8ulTi76MzVEKO6nC8NtbqqE4yxqdIORxrK7lHFLdCNT/AGoN+e+9K/gNrHxBFZqfEC2OZwT9fWjsfCKHWXeS+LyHcx5G/SmR8sp351JEWNnGaYjc6jagDvUUcDnmhz161UmWv5RTM7Rttx45fOpkeh+ORJ04WAzjHypAIVTBNsQucbjl86YC7hceIqRxbZpDI+sj7S2ZgBtxEgcwMY/WmiMiHG7SyEtuM0xE+3yDsBvv6UhkvkoV9iPSkSJCHhYkZ4hzpAORkhWUE92evLAoGSI+FxxFePzUj6b0Air11z3C7EShwFpxE3X7m89nllLr+i6zoTXl7HGY+9gt7aONhKznBDs58KBlUnHmeuKzSbR2YJSqXhnOL+Fo7sB14TuGHkRzH4ir8btHM1UNmR/c9Dahoi6N7O9RtZciS07LOeALjgLBeLJzndienSqbuZY+MTR5tvrZI5I2VcqQPxFaUY2i3ubZJuz+VbJXp5b/APql5H4M6lxJHji8ZHmKe1Ellkiwj7QahGhSCd4wRg8JxtUfTjfKG9Rk6TorT3l3NHEuXldgi56kmpt7VZUk5ul2zWpay2YSG9kL3cbMZGdy2/18sEVWpbla6LXBwbi+0OqyheAFeIk8WaYg8ScGUfYE+LHOgBtLZ5CzuwZR6+lAFFrJHvxVSMqgG1Mj5Kh+dSREbNMRqtMvjHKIps931qDRYm0P3toWJdAzAgE49eVAFXJE8ZD4PpTIj0E4nxFKSDnZvKk/sMO6iaFCrAnrnoaLDoi6qGMMKhfGjYG/QimhNcCbeIRRDqetMSJETZYeHbPPypEkTSCEBctny/KkPkkYyPPw4z57dKQBpkmN1Kn/ABGeVADyzLwAMWVlGNxtn50DKvVWzJbxE5PGT9BTQmbH2Z3VxH2lsLaz1R9JuZZDbi+UZMaSDfA+mPrWbMmpWvJ2dBKOTBKE47tvj5v/ALNLrvs3a37cdl7Nbt9Sg1a7jEt0YWiy/GrSgBhkjgZTnrk0YpOPDI62CyR9SMa2vlfY7V7XrCK39nHbK8Ti7yXTWi35BA4I9etOC9yZhyS9m08dXUJljZFUBgeIDpWgyjEc96sXuokVIzsQq5J+tPgVDs1ijWsMqoSzAgnzxVe+pNGqOJSgpIrJYFDbg+g5VYmVOCRpewNjaz60jXEfF3fijGduLzPyrNqZNR4N+gxxc+Uart7Ye66tFew8Qhu0Ktw9JF6/UfpVWknacH4JfUsVSWReTNqzklQu+5PkK2HMseRB3akqRg/TnQAcrhUPFgk7DA9KSBmSvXaS/uGbGc42qfgiQH5mmRYimI1N5YSsBIEJwOaf7VWpIsaYnT7sozRTnhY7Zb86k0RXA9dr48xkFD4jikSZBktVnBYMEceVMiR0up7Ru7ul44OR2oqw5Q9fzrLFbSIQUY8LehA2/KhA+iI02cAcqdCHIJeHctnzGNqGBaQTAxhl3Ox2PPffnSJIdaXJAJGMnB5fSkOwKeYAyRyH1oAeV85GcEZBGMUhlTeuDqQK4IjQdPPepLoi+yVaahLY3dve2RAuIJFkj4hnxKQw/MVCcbXJo02X058eeD1R2Nll7VXen6tpqWz3yW8+pWReVCwdoxEV7vgBVBJI2CzNkx86ocGm2ldG+WaO3bN0nSf7f++Bv2oyahF7Nu3Er3Ms+jNYRRwmbPH7wZgJMA+JVA4cA/TPOnhd9lOsjGKSSp/7eDyyNi2Q25zv1rQc4YRfGSMHA2NMCy08iTTyW4SI7h0x6YWs073/AIOhg5xfkdt7C3uboZBznAFDk0hrGpMc7LwPZ6qzyDhCsRio5nujRdpYbZWbDt7cRtommRBuIyXPF9Ahz+tZ9In6jf2L/qbXpJfcwLLeyYa1mUpgDB5g+ldLg4XPgcR7pGHeNnqGoDkXwNx5c5U/rSGUGpJ3d9MB1ANMiVrczUiAjIpgatO8hwlu0QTpm4BJNQ/cs/YXM90UXvrSOVTvsyn/AHo4DkBZGASRZ4QeXEuR+POgCNJEVkLRssikkgxn9udMQy6l0dQrHJ3ytIKKmZjbs9sCSocN8jj/AHqa55IMJDk0gJCR9ckfzQMm28nBg8ZU8s+VIY6JBxZfDjo2d6KGAT4PLhwPnQBPt5e8jypXIXBI3zSGituo+K8kcYx6U/BHyNNxAlcftQPlcnoX+nNLm00rtpqN3cSy2VrpkcUETSkqiSF3IUZAGcdMVnlK4SOm8f8ANxtP9TTRL7YXkDf06649kpS0udRjSAb54e9j8yTzVutGFUhfUpN5Pd3R55OXQHc4HD4avOaAKsXCAwzy23FAxGjXYHvMDcjKXGeuRj9qrnHpmrBkSTiXFlMqXaHJ+IVXJcF8X7iwidRqjEkp4sHbnVcl7TRCVStjXafUPe9ShihZzFbRMMnqxG59Klpobbb8lGvy7+F4K2CQjPFsoG4JyK0nNskmZVZc4QdCdwf9qBi5ZREvE65yNsDY0DMzq0om1GdgBgAKAKl0iPllVJnJpogxIG1AUX8mp6fOOGewiBGwaPKGoqNeSblfaGi2nHeGe4h5bHxD86fIuB5D4/stWGx2LIf5o/AcfI3cTzo3FOVnHPiCY688igORSXiNFhJpozy58X60qFZVXkayXqiDiYsMtnzqS6FLsnQ2oReKRgMDl50NjSA8sabYwT1zQFkT3rAwOfLFFCsNO9lYcKH1IHOgOSbFZyhfGrcuW+cUmx0ydFiIYXc+WDkUh9DwiBPiILHmfWgZXXPx7KpwcEimI9Sf0o2+k652E1/Tbu3Y3aXEUV59o2ZYhloeuw+JcDHI+dReNNP7lq1M47a/puh7+pXQ7Ts57KYLHS0MNpcaxEe7Ll8ErI53O+MqKjGO3geXNLM90uzzAVxvxADmdqsKRhmLTjBySR6A0vAeSEkLWt8ytyfcH60PlFkOJF9akELkb8Qqho3RY5q1wRKCnMnz5VGC4JZJFfAWPeuMjIxnP5VdBGLN4FxMWPLA675NWFBKaQyRqhKuCMYYbEYpUSsYlV7ZC0A762YfaRk+JPVT1+VHfYuuiku14Lqb/FsMp8weRpiIEhyaaIsSKBqzRNJeA/aT2b9Cr4P7Uh39xQ4+MgQ26nqYphj8DQAbq7SH7IEeRRG2+YoCyMweAgmDnuAhK5HyoEMTzQTMDJbNGdvENqYX8jSypDI3Dhthv50CsblnlmY8K7+nKgLHIdOuJ3BfZTQ2NItrXTbSBQXPG3X0pNkkkiyVYYMgEb5wP0qI7RCudQTZYUBz5U6I7h6xhchHkGCxyq+Y670MaJPcKjE8wN8f70hkG9s+7WR+LYeVNMTR2H+mbtvonYmHtTd9pL2Ozs7lrZIzu7s6iQkcK5OMHny6c6lfNEWrXBpfbb7TeyftC7C3Ondnbq6uLyxmi1DxWzondo3A5LEYGBJ164pSfQ4Ls85TMoJVWTPnSBsZ4guCxPyz+dMOEyVdwi8sw0Y+2iJI9R5VFE/IuxkHcK/XGd6ra5NcJcWIuZOM5bHmTSSG3Y3lVQEf3Hbfyq2K4MmZpyArfab7nJGB1qRWOlisYHIEjHzzQNsegkyVyOIHmaQIqtUgEUagZPAxQZ/x5igRSvjNSIsIUDLaO1DkcVvcHPXGP1pWOmPmwgAw/HH85Ac/QCiwJUVnB4mUSlRjdmABpWAi5ESyB41BHoORoAj3MiSIwAAwPhI/8xTFZFtbRWl8Trw55HnQIs4YYIwQuOJfSkSJCsFGGyC2/mPlQMRI2VbJ22OMYIPpQIcQCUgFWC8s0DHIbaCM8YAbO4LA5PrSAde4RH4mdFboMUBYn3qNyPGAPJdqKHYzPcZjYd5uRvvz6U0JsZsbXULa3N7aacL+ylYWEhnty8PeyKeFM7faAeIYORzpScW9rfPY4qS5X7HRfar2E12z7a6jbdntGlubCUwRh9MsmjiDYVDHwjkO8RsZJzjOetU48kUqb/yXZISm9yXD/b/oB9jHaTT+zl1qOsyWdvemFhbaegEsrtjOGYbIcZxgnfap+pb4RH0qVXycdjkaWUqxIJBGD51cZy007UDbOkrfdPs4xyI51Fqyd+S0urYyxmewBdXHiRRkg+eP2qtr5L4y4orpPsBm5BV8fC3PPyppWEsm39xhrgSP0I5ADkKsozt3yATKq8bvgg9OppisNJWJGcDG5Hl5fWkOyUjkqVTOeWR1oAja228QB24c7888qSGyibnUiABmgkXKzSLEHkdpHY7En4aQh5QI1WR/tGbfxchQNMlIWdkLnJO/ypBYTODG2VBzigCNPbwyYLR7kZypxTsOyDcwe7SnhfIYZ3HKhOxNVyCOQgZ2pgmPlyFG9ILFrMzLk8xuP0ooCSxCLuOLAwPSgYTzuy4BKr/iOVILIzycJYKMAU6BsZ75jvtigSFhsqWIyOWKdD+52bsF2NXUPZ1Jrt9qd2Y9Jae+s7ODCIs4CsHbOQxzGvTltVEpNtpGj01FJvmzTaRpN5pWuaWdJ1e4to7y394niZe8U8PCcLk5U5kbxZJo6JbU2bDWXlm0+SR5nMseGVyeRBH80kKjzH7YNKg0btvObLwJcxrecAGAjMTxAemQT9avg+DPkVSMvKQiqwA4ZVDFOmaZH7g94mT4ZGGMelAyPK5c5Yk58zmhCfYkysNs06EPW+WCuxyf0oYEmI+Ic8nmc0mNEmJjwqdgCpOMUhjOq/d2/wD2kUUMqTzNMgFQPo//2Q=="
      alt=""
    />

            
          </div>
            <div class="qr">
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        </div>
      </div>
      <div class="main">
        <div class="total-item"><span>total:${formatMoney(
          totalItem
        )}</span></div>
        <div class="wrap-item">
          <table>
            <tr>
              <th>id</th>
              <th>name</th>
              <th>amount</th>
              <th>price</th>
              <th>total</th>
            </tr>
           ${renderDataTable}
          </table>
        </div>
        <div class="note">
          <span>note</span>
        </div>
        <div class="row caculator-price">
          <div class="price-left">
            <div>Breakdown</div>
            <div>
            10% target 39,600 (consumption tax 3,600)</div>
            <div>8% (reduction) target 64,800 (consumption tax 4,800)</div>
          </div>
          <div class="price-right">
            <div class="row">
              <div class="col-6 label">total</div>
              <div class="col-6 text-right">${formatMoney(totalPrice)}</div>
            </div>
            <div class="row">
              <div class="col-6 label">vat</div>
              <div class="col-6 text-right">${formatMoney(vat)}</div>
            </div>
            <div class="row">
              <div class="col-6 label">last total</div>
              <div class="col-6 text-right">${formatMoney(
                totalPrice + vat
              )}</div>
            </div>
          </div>
        </div>
        <div class="remarks">
          <h5>Remarks column</h5>
          <div class="content-remarks"></div>
        </div>
      </div>
      </div>
`;
};
