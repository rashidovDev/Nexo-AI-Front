import React, { useMemo, useState } from "react"

import { AnimatePresence, motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import { Sparkles, ShieldCheck, MessageCircle, PhoneCall, X } from "lucide-react"
import { useSession } from "next-auth/react"

import { useModal } from "@/services/use-modal"
import { toast } from "@/hooks/use-toast"
import { IChat, IUser } from "@/types"
import { apiClient } from "@/services/api/axios"
import { generateToken } from "@/lib/generate-token"
import { useCurrentChatUser } from "@/services/current-chat"
import { useSelectedOption } from "@/services/current-option"
import { Oval, Puff } from "react-loader-spinner"

interface Props {
  contacts: IUser[]
}

const OWNER_ID = process.env.NEXT_PUBLIC_OWNER_ID || "69045c8a92aa1cd5d930fef9"

const ModalContactOwner: React.FC<Props> = ({ contacts }) => {
  const [isStartingChat, setIsStartingChat] = useState(false)
  const { setOpenContactOwnerModal, openContactOwnerModal } = useModal()
  const { setCurrentChatUser, setCurrentChatId } = useCurrentChatUser()
  const { setSelectedOption } = useSelectedOption()
  const { data: session } = useSession()
  const router = useRouter()

  const ownerContact = useMemo(
    () => contacts.find((contact) => String(contact._id) === OWNER_ID),
    [contacts]
  )

  const ownerFullName =
    `${ownerContact?.firstName ?? ""} ${ownerContact?.lastName ?? ""}`.trim() ||
    ownerContact?.username ||
    "Owner"

  const handleStartChat = async () => {
    if (!ownerContact?._id) {
      toast({ description: "We could not locate the owner contact.", variant: "destructive" })
      return
    }

    if (!session?.currentUser?._id) {
      toast({ description: "Please sign in to start a conversation.", variant: "destructive" })
      return
    }

    setIsStartingChat(true)
    try {
      const token = await generateToken(session.currentUser)
      const { data } = await apiClient.post<IChat>(
        "/chat/create-dm",
        { userId: ownerContact._id },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      setCurrentChatUser(ownerContact)
      setCurrentChatId(data._id)
      setSelectedOption("chats")
      router.push(`/?chat=${data._id}`)
      toast({ description: `You're all set to chat with ${ownerFullName}!` })
      setOpenContactOwnerModal(false)
    } catch {
      toast({ description: "Unable to start chat with the owner.", variant: "destructive" })
    } finally {
      setIsStartingChat(false)
    }
  }

  const closeModal = () => setOpenContactOwnerModal(false)

  return (
    <>
    {
    session?.currentUser?._id !== OWNER_ID &&
    <AnimatePresence>
      {openContactOwnerModal && (
        <motion.div
          key="modal-backdrop"
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur"
          onClick={closeModal}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            key="modal-box"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.25 }}
            onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-900 text-white shadow-2xl"
          >
            <div className="pointer-events-none absolute -left-10 -top-16 size-56 rounded-full bg-primary/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -right-10 size-72 rounded-full bg-secondary/30 blur-3xl" />

            <div className="relative z-10 p-7 md:p-9">
              <div className="flex items-start justify-between">
                {/* <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium text-white/80">
                    <Sparkles className="size-4 text-primary" />
                    Priority Support
                  </div>
                  <h2 className="mt-4 text-3xl font-semibold tracking-tight">
                    Need something? Talk to the owner
                  </h2>
                  <p className="mt-2 text-sm text-white/70">
                    Direct access to the product owner for feedback, account support, and partnership
                    questions.
                  </p>
                </div> */}
                <div><h2 className="mt-4 text-2xl font-semibold tracking-tight">
                    Need something? Talk to the owner
                  </h2></div>

                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-full border border-white/10 bg-white/5 p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
                  aria-label="Close contact owner modal"
                >
                  <X className="size-4" />
                </button>
              </div>

              {ownerContact ? (
                <>
                  <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm sm:flex-row sm:items-center">
                    <div className="flex items-center gap-4">
                      <div className="rounded-2xl border border-white/10 bg-white/10 p-2">
                        <Avatar className="size-16">
                          <AvatarImage
                            src={ownerContact.userImage?.url}
                            alt={ownerFullName}
                            className="object-cover"
                          />
                          <AvatarFallback className="text-lg font-semibold text-white">
                            {ownerFullName.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div>
                        <p className="text-lg font-semibold">{ownerFullName}</p>
                        <p className="md:text-sm text-[10px] text-white/70">{ownerContact.email}</p>
                        {ownerContact.bio && (
                          <p className="mt-2 md:text-sm text-[12px] text-white/60">{ownerContact.bio}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    {[
                      {
                        icon: ShieldCheck,
                        label: "Verified owner",
                        value: "Direct contact",
                      },
                      {
                        icon: MessageCircle,
                        label: "Avg. response",
                        value: "< 30 min",
                      },
                      {
                        icon: PhoneCall,
                        label: "Live hours",
                        value: "Mon - Fri",
                      },
                    ].map(({ icon: Icon, label, value }) => (
                      <div
                        key={label}
                        className="rounded-2xl border border-white/10 bg-white/5 px-4 md:py-5 py-2 text-sm text-white/70"
                      >
                        <div className="flex items-center gap-3 text-white">
                          <Icon className="size-4 text-primary" />
                          <span className="md:text-xs text-[10px] uppercase tracking-widest text-white/60">
                            {label}
                          </span>
                        </div>
                        <p className="md:mt-3  mt-2 md:text-lg text-[12px]  font-semibold text-white">{value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 space-y-3">
                    <Button
                      type="button"
                      onClick={handleStartChat}
                      disabled={isStartingChat}
                      className="md:h-12 h-10 w-full text-base font-semibold shadow-lg shadow-primary/30"
                    >
                      {isStartingChat ? "Preparing chat…" : "Send message"}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={closeModal}
                      className="h-12 w-full text-base text-white/80 hover:bg-white/5 hover:text-white"
                    >
                      Maybe later
                    </Button>
                  </div>
                </>
              ) : (
                <div className="mt-8 flex justify-center ">
                 <Puff
visible={true}
height="70"
width="70"
color="#5900D0"
ariaLabel="oval-loading"
wrapperStyle={{}}
wrapperClass=""
/>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    }
    </>
  )
}

export default ModalContactOwner
