/* 
    / - Home Page 
*/

import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center">
      <div className="flex w-full max-w-3xl flex-col gap-8 rounded-2xl border border-border bg-surface p-6 shadow-sm sm:gap-10 sm:p-10">
        <Image
          className="h-5 w-[100px]"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xl text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
            To get started, edit the{" "}
            <code className="rounded bg-background px-1.5 py-0.5 font-mono text-[0.9em] text-muted">
              page.tsx
            </code>{" "}
            file.
          </h1>
          <p className="max-w-md text-lg leading-8 text-muted">
            Looking for a starting point or more instructions? Head over to{" "}
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-semibold text-brand underline-offset-4 hover:underline"
            >
              Templates
            </a>{" "}
            or the{" "}
            <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-semibold text-brand underline-offset-4 hover:underline"
            >
              Learning
            </a>{" "}
            center.
          </p>
        </div>
        <div className="flex flex-col gap-3 text-base font-semibold sm:flex-row">
          <a
            className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-brand px-5 py-3 text-white transition-colors hover:bg-brand/90 focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 md:w-auto"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="h-[14px] w-4"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={14}
            />
            Deploy Now
          </a>
          <a
            className="flex min-h-11 w-full items-center justify-center rounded-lg border border-border bg-surface px-5 py-3 text-foreground transition-colors hover:border-brand hover:bg-background focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 md:w-auto"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </div>
    </div>
  );
}
