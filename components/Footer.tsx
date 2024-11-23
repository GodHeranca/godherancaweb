import React from 'react';
import Image from 'next/image';

function Footer() {
    return (
        <div className="flex flex-col md:flex-row justify-between items-center p-4 md:p-10 bg-white">
            <p className="mt-2 text-center md:text-left">&copy; 2024 GodHeranca. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-2">
                <a
                    href="https://www.facebook.com/profile.php?id=61558722816297"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Image src='/facebook.svg' alt='facebook' width={20} height={20} />
                </a>
                <a
                    href="https://www.instagram.com/godheranca/"
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
                    href="https://www.linkedin.com/company/godheran%C3%A7a/"
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
