import Image from 'next/image';

const HomePage: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-12 bg-white ">
            <div className="text-center max-w-4xl px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl lg:text-6xl">
                    Welcome to the Supermarket Dashboard
                </h1>
                <p className="mt-4 text-lg leading-6 text-gray-600 sm:text-xl">
                    Manage your supermarket's products, monitor sales, and stay ahead of the competition with our all-in-one solution.
                </p>
            </div>

            <div className="mt-8 flex justify-center">
                <Image
                    src="/Godheranca.png" // Replace with your actual image
                    alt="Supermarket Dashboard"
                    width={500}
                    height={300}
                    className="rounded-lg shadow-lg h-auto w-auto"
                    priority={true}
                />
            </div>

            <div className="mt-10 text-center">
                <p className="text-md text-gray-600 sm:text-lg">
                    Easily add products, track inventory, and analyze sales trends—all in one place.
                </p>
                <a
                    href="/signup"
                    className="mt-6 inline-block px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-700 hover:bg-black-400"
                >
                    Get Started
                </a>
            </div>
        </div>
    );
};

export default HomePage;
