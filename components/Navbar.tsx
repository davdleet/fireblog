import Link from 'next/link'
import { useContext } from 'react'
import { UserContext } from '../lib/context'
// Top navbar
export default function Navbar() {
    const { user, username } = useContext(UserContext)
    return (
        <nav className="navbar">
            <ul>
                <li>
                    <Link href="/">
                        <button className="btn-logo">FEED</button>
                    </Link>
                </li>

                {/* user is signed in and has a username */}
                {
                    username && (
                        <>
                            <li className="push-left">
                                <Link href="/admin">
                                    <button>Write Posts</button>
                                </Link>
                            </li>
                            <li>
                                <Link href={`/${username}`}>
                                    <img src={user?.photoURL} alt="" />
                                </Link>
                            </li>
                        </>
                    )
                }

                {/* user is not signed in OR has not created a username*/}
                {
                    !username && (
                        <li>
                            <Link href="/enter">
                                <button>Log in</button>
                            </Link>
                        </li>
                    )
                }
            </ul>
        </nav>
    )
}