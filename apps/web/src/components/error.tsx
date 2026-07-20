import Link from "next/link";

interface ErrorComponentProps {
  message: string;
  link?: string | null;
  linkText?: string | null;
}

export default function ErrorComponent({ message, link = null, linkText = null }: ErrorComponentProps) {
  return (
    <div className="w-full flex flex-col gap-2 justify-center pt-64 items-center">
      <div className="text-gray-500">{message}</div>
      {link && (
        <Link
          href={link}
          className="bg-[#2d050c] border-2 hover:brightness-110 transition-all duration-150 shadow-[2px] hover:shadow-[4px] shadow-gray-400 px-4 py-1.5 hover:cursor-pointer text-sm text-[#d75857] rounded-md"
        >
          {linkText}
        </Link>
      )}
    </div>
  );
}
