"use client";

import { useActionState } from "react";
import isMobile from "@/hooks/isMobile";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { sendFeedback } from "@/actions/feedback";

const initialState = { message: null };

export default function Feedback() {
  const [state, formAction, isPending] = useActionState(
    sendFeedback,
    initialState,
  );
  const sent = state.message === "success";

  return (
    <Sheet>
      <SheetTrigger>
        <span className="inline-flex cursor-pointer 2xl:text-base items-center gap-1.5 rounded-full bg-black/40 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)]">
          <span className="hidden md:inline">Leave</span>
          <span>Feedback</span>
        </span>
      </SheetTrigger>

      <SheetContent
        side={isMobile() ? "bottom" : "right"}
        className={`${isMobile() ? "max-h-[80dvh]" : "max-h-screen"} bg-sideBarBackground`}
      >
        <SheetHeader>
          <SheetTitle>Leave Feedback</SheetTitle>
          <SheetDescription>
            Tell me what you loved about this.
          </SheetDescription>
        </SheetHeader>

        {sent ? (
          <p className="p-4 text-sm text-green-600">
            Thanks for your feedback! It means a lot. 🎉
          </p>
        ) : (
          <form action={formAction} className="flex flex-col gap-4 p-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="feedback-name" className="text-sm font-medium">
                Name
              </label>
              <input
                id="feedback-name"
                name="name"
                maxLength={100}
                placeholder="Your name"
                className="rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="feedback-description"
                className="text-sm font-medium"
              >
                Description
              </label>
              <textarea
                id="feedback-description"
                name="description"
                maxLength={2000}
                rows={4}
                placeholder="What did you love?"
                className="resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            {state.message === "error" && (
              <p className="text-sm text-red-600">
                {state.error || "Something went wrong. Please try again."}
              </p>
            )}

            <Button type="submit" disabled={isPending}>
              {isPending ? "Sending…" : "Submit"}
            </Button>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
}
