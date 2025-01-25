'use client';

import { Menu } from '@headlessui/react';
import Link from 'next/link';
import { FaGamepad, FaHistory, FaCrown, FaSignOutAlt } from 'react-icons/fa';

function Nav() {
  return (
    <Menu as="nav" className="relative bg-black  navbar-left">
    
      <ul className="menu menu-custom-style w-56 text-white p-2 shadow-lg">
    
        <Menu.Item>
          {({ active }) => (
            <li
              className={`${
                active ? 'bg-gray-700 text-blue-400' : 'text-gray-200'
              } rounded-md`}
            >
              <Link href="/" className="flex items-center gap-2 p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Home
              </Link>
            </li>
          )}
        </Menu.Item>

        {/* Profile */}
        <Menu.Item>
          {({ active }) => (
            <li
              className={`${
                active ? 'bg-gray-700 text-blue-400' : 'text-gray-200'
              } rounded-md`}
            >
              <Link href="/user/profile" className="flex items-center gap-2 p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Profile
              </Link>
            </li>
          )}
        </Menu.Item>

        {/* Nowa Gra */}
        <Menu.Item>
          {({ active }) => (
            <li
              className={`${
                active ? 'bg-gray-700 text-blue-400' : 'text-gray-200'
              } rounded-md`}
            >
              <Link href="/user/nowa-gra" className="flex items-center gap-2 p-2">
                <FaGamepad className="h-5 w-5" />
                Nowa Gra
              </Link>
            </li>
          )}
        </Menu.Item>

        {/* Ostatnie Gry */}
        <Menu.Item>
          {({ active }) => (
            <li
              className={`${
                active ? 'bg-gray-700 text-blue-400' : 'text-gray-200'
              } rounded-md`}
            >
              <Link href="/user/ostatnie-gry" className="flex items-center gap-2 p-2">
                <FaHistory className="h-5 w-5" />
                Ostatnie Gry
              </Link>
            </li>
          )}
        </Menu.Item>

        {/* Ranking
        <Menu.Item>
          {({ active }) => (
            <li
              className={`${
                active ? 'bg-gray-700 text-blue-400' : 'text-gray-200'
              } rounded-md`}
            >
              <Link href="/user/ranking" className="flex items-center gap-2 p-2">
                <FaCrown className="h-5 w-5" />
                Ranking
              </Link>
            </li>
          )}
        </Menu.Item> */}

        {/* Logout */}
        <Menu.Item>
          {({ active }) => (
            <li
              className={`${
                active ? 'bg-gray-700 text-blue-400' : 'text-gray-200'
              } rounded-md`}
            >
              <Link href="/user/signout" className="flex items-center gap-2 p-2">
                <FaSignOutAlt className="h-5 w-5" />
                Wyloguj się
              </Link>
            </li>
          )}
        </Menu.Item>
      </ul>
    </Menu>
  );
}

export default Nav;
