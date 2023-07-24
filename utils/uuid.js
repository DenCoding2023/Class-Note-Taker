const generateRandomString = () =>
  Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);

const linkText = "Visit our App";
const randomString = generateRandomString();
const url = `https://www.example.com/${randomString}`;

const markdownLink = `[${linkText}](${url})`;

console.log(markdownLink);
