import React from 'react'
import Image from 'next/image'

const Header = () => {
    return (
        <nav className='bg-white p-4'>
            <ul className='flex items-center justify-between max-w-4xl mx-auto'>
                <li>
                    <Image src='/G.png' alt='logo' width={40} height={40} />
                </li>
            </ul>
        </nav>
    )
}

export default Header
