import React from 'react';
import Image from 'next/image';

function Footer() {
    return (
        <div className=" flex justify-evenly p-10 bg-white bottom-0 w-full">
            <p className="mt-2">&copy; 2024 GodHeranca. All rights reserved.</p>
            <div className="flex gap-4 mt-2">
                <a
                    href="https://www.facebook.com/GodHeranca"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Image src='/facebook.svg' alt='facebook' width={20} height={20} />
                </a>
                <a
                    href="https://www.instagram.com/GodHeranca"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Image src='/instagram.svg' alt='instagram' width={20} height={20} />
                </a>
                <a
                    href="https://twitter.com/GodHeranca"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Image src='/twitter.svg' alt='twitter' width={20} height={20} />
                </a>
                <a
                    href="https://www.linkedin.com/in/GodHeranca"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Image src='/linkedin.svg' alt='linkedin' width={20} height={20} />
                </a>
            </div>

        </div>
    );
}

export default Footer;
