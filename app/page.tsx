import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-start bg-white p-4">
      <p className="text-xl font-bold mb-4">Supermercado Atacadista</p>
      <div className="flex space-x-8">
        <div className="flex h-auto  rounded-3xl w-auto">
          <Link href="/supermarket-page" className="flex flex-col items-start ">
            <Image
              src="/Desco_Campo-Bom.jpg" // Update with your image path
              alt="Supermarket"
              width={559}
              height={241}
              className="rounded-3xl"
            />
            <p className="mt-1 text-lg font-semibold text-left">Desco Atacado</p>
          </Link>
        </div>
        <div className="flex h-auto rounded-3xl w-auto">
          <Link href="/supermarket-page" className="flex flex-col items-start ">
            <Image
              src="/imec.jpg" // Update with your image path
              alt="Supermarket"
              width={559}
              height={241}
              className="rounded-3xl"
            />
            <p className="mt-1 text-lg font-semibold text-left">Imec</p>
          </Link>
        </div>
      </div>
    </main>
  );
}
