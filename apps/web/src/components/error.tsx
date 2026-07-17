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
          className="border hover:border-2 transition-all duration-75 shadow-[2px] hover:shadow-[4px] shadow-gray-400 px-4 py-1.5 hover:cursor-pointer text-sm text-gray-400 rounded-md"
        >
          {linkText}
        </Link>
      )}
    </div>
  );
}
