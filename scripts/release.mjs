import { spawn } from "node:child_process";

const ROOT_DIR = process.cwd();

function runShellCommand(command, label) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, [], {
      cwd: ROOT_DIR,
      stdio: "inherit",
      shell: true,
    });

    child.on("error", (error) => {
      reject(new Error(`${label} failed: ${error.message}`));
    });

    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${label} failed with exit code ${code}`));
      }
    });
  });
}

async function main() {
  const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
  const vercelCommand =
    process.platform === "win32"
      ? `${process.env.AppData}\\npm\\vercel.cmd`
      : "vercel";
  const target = (process.argv[2] ?? "prod").toLowerCase();
  const isProd = target === "prod" || target === "production";

  console.log("== Release: lint ==");
  await runShellCommand(`${npmCommand} run lint`, "lint");

  console.log("== Release: preflight ==");
  await runShellCommand(`${npmCommand} run preflight`, "preflight");

  if (isProd) {
    console.log("== Release: deploy production ==");
    await runShellCommand(`${vercelCommand} --prod --yes`, "vercel production deployment");
  } else {
    console.log("== Release: deploy preview ==");
    await runShellCommand(`${vercelCommand} --yes`, "vercel preview deployment");
  }

  console.log("Release completed successfully.");
}

main().catch((error) => {
  console.error(`Release failed: ${error.message}`);
  process.exit(1);
});
