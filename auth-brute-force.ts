import axios from "axios";

export const test = async (username: string, password: string) => {
  try {
    const response = await axios.post("http://localhost:3000/login", {
    username,
    password,
  });
  return true;
  } catch (error) {
    return false;
  }
};

async function main() {
  const characters =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const passwordLength = 3;
  let password = "";
  for (let i = 0; i < passwordLength; i++) {
    password += characters.charAt(0);
  }
  while (!await test("user1",password)) {
    for (let i = passwordLength - 1; i >= 0; i--) {
      let charIndex = characters.indexOf(password.charAt(i));
      if (charIndex === characters.length - 1) {
        password =
          password.slice(0, i) + characters.charAt(0) + password.slice(i + 1);
      } else {
        password =
          password.slice(0, i) +
          characters.charAt(charIndex + 1) +
          password.slice(i + 1);

        break;
      }
    }
  }
  console.log(
    `Password found: ${password}`
  );

}

main();
