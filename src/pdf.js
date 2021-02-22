import { jsPDF } from "jspdf";
import convertHtml from "./convert";

const items = [
  {
    id: 1,
    name:
      "gem kastamita uku katarian yasuo ok phie lavie suc to kill ketaraito omoshizuku hehehehe llalalalallala",
    amount: 2,
    price: 2000,
    details: [
      {
        name: "gold kastamita ketaraito omoshizuku",
      },
      {
        name: "diamond",
      },
    ],
  },
  {
    id: 2,
    name: "gem kastamita ketaraito omoshizuku",
    amount: 2,
    price: 2000,
    details: [
      {
        name: "gold",
      },
      {
        name: "diamond",
      },
    ],
  },
  {
    id: 3,
    name: "gem",
    amount: 2,
    price: 2000,
    details: [
      {
        name: "gold",
      },
      {
        name: "diamond",
      },
    ],
  },
  {
    id: 4,
    name: "gem",
    amount: 2,
    price: 2000,
    details: [
      {
        name: "gold",
      },
      {
        name: "diamond",
      },
    ],
  },
  {
    id: 5,
    name: "gem",
    amount: 2,
    price: 2000,
    details: [
      {
        name: "gold",
      },
      {
        name: "diamond",
      },
    ],
  },
  {
    id: 6,
    name: "gem",
    amount: 2,
    price: 2000,
    details: [
      {
        name: "gold",
      },
      {
        name: "diamond",
      },
    ],
  },
];

export default () => {
  const pdf = new jsPDF({ unit: "px", format: "letter", userUnit: "px" });
  var width = pdf.internal.pageSize.getWidth();
  var height = pdf.internal.pageSize.getHeight();
  console.log("width", width);
  console.log("height", height);
  pdf.html(convertHtml(items, width, height)).then(() => {
    pdf.save("file.pdf");
  });
};
