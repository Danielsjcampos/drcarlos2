'use client'

import React, { useState, useEffect } from 'react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { BlogListingContent } from '@/components/sections/BlogListingContent'
import { Loader2 } from 'lucide-react'

export default function BlogListingPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/blog/public')
      .then(r => r.json())
      .then(data => {
        // Map data to match Post interface if needed
        const mappedPosts = Array.isArray(data) ? data.map((p: any) => ({
          id: p.id,
          title: p.title,
          excerpt: p.metaDescription || p.content.replace(/<[^>]*>/g, '').substring(0, 160) + '...',
          date: new Date(p.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }),
          author: 'Dr. Carlos Prado',
          slug: p.slug,
          imageUrl: p.imageUrl
        })) : []
        setPosts(mappedPosts)
      })
      .catch(err => console.error('Failed to fetch posts'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {loading ? (
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="h-10 w-10 text-emerald-500 animate-spin" />
        </div>
      ) : (
        <BlogListingContent posts={posts} />
      )}

      <Footer />
    </div>
  )
}
