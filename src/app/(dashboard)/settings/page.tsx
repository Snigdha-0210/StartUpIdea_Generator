"use client"
import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { auth, db } from '@/lib/firebase'
import { onAuthStateChanged, signOut, User } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { Activity, LogOut, ShieldCheck } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [profileData, setProfileData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
        // Fetch custom profile data from Firestore
        const docRef = doc(db, 'users', currentUser.uid)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          setProfileData(docSnap.data())
        }
        setLoading(false)
      } else {
        // Redirect to standalone login page
        router.push('/login')
      }
    })
    return () => unsubscribe()
  }, [router])

  const handleLogout = async () => {
    await signOut(auth)
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Activity className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-20">
      <PageHeader title="Settings" description="Manage your account, profile, and security preferences." />

      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="border-emerald-500/20 shadow-sm overflow-hidden">
          <div className="bg-emerald-500/10 p-6 flex items-center gap-4 border-b border-emerald-500/10">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-600 border border-emerald-500/30">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-emerald-950 dark:text-emerald-50">Securely Authenticated</h2>
              <p className="text-emerald-700 dark:text-emerald-400 font-medium">Logged in as {user?.email}</p>
            </div>
          </div>
          <CardContent className="p-8 space-y-6">
            <div className="grid sm:grid-cols-1 gap-6">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Full Name</span>
                <p className="text-lg font-bold">{profileData?.name || 'N/A'}</p>
              </div>
            </div>
            <hr className="border-border/50" />
            <div className="pt-2">
              <Button variant="destructive" onClick={handleLogout} className="font-bold">
                <LogOut className="w-4 h-4 mr-2" /> Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
