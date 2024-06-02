import React from 'react'
import Image from 'next/image'
import shareIcon from '@/public/share.svg'
import xIcon from '@/public/x-twitter.svg'
import linkedinIcon from '@/public/linkedin.svg'
import facebookIcon from '@/public/facebook.svg'
import Link from 'next/link'

function ShareButtons({post}) {
  const hostname = window.location.hostname
  const post_url = `https://${hostname}/blog/${post.slug}`

  https: return (
    <div className="flex justify-end">
      <div className="flex justify-end items-center share-wrapper">
        <div className="flex justify-end items-center hover-content opacity-0 share">
          <Link
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURI(post_url)}`}
          >
            <Image
              className="m-0 mr-3"
              priority
              src={facebookIcon}
              width={28}
              alt="Compartir en Facebook"
            />
          </Link>
          <Link
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(post_url)}`}
          >
            <Image
              className="m-0 mr-3"
              priority
              src={linkedinIcon}
              width={28}
              alt="Compartir en Linkedin"
            />
          </Link>
          <Link
            href={`https://x.com/share?url=${encodeURIComponent(post_url)}`}
          >
            <Image
              className="m-0 mr-3"
              priority
              src={xIcon}
              width={28}
              alt="Compartir en X"
            />
          </Link>
        </div>
        <div>
          <Image
            priority
            src={shareIcon}
            width={32}
            alt="Compartir"
            className="m-0 hover-trigger"
          />
        </div>
      </div>
      <Link className="button" href={`/blog/${post.slug}`}>
        Ver Post
      </Link>
    </div>
  )
}

export default ShareButtons
