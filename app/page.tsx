import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-start bg-white p-4">
      <p className="text-xl font-bold mb-4">Supermercado Atacadista</p>
      <div className="flex justify-between space-x-8">
        <div className="flex h-auto rounded-3xl w-auto">
          <Link href="/supermarket-page" className="flex flex-col items-start ">
            <Image
              src="/Desco_Campo-Bom.jpg"
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
              src="/imec.jpg"
              alt="Supermarket"
              width={559}
              height={241}
              className="rounded-3xl"
            />
            <p className="mt-1 text-lg font-semibold text-left">Imec</p>
          </Link>
        </div>
      </div>

      {/* Add Coming Soon Sections */}
      <div className="flex flex-col items-start mt-8 w-full">
        <p className="text-xl font-bold ">Coming Soon</p>
        <div className="flex space-x-8 -mt-4">
          <div className="flex flex-col items-center">
            <Image
              src="/playstore.svg" 
              alt="Coming Soon on Play Store"
              width={150}
              height={50}
            />
          </div>
          <div className="flex flex-col items-center">
            <Image
              src="/appstore.svg" 
              alt="Coming Soon on App Store"
              width={150}
              height={50}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
