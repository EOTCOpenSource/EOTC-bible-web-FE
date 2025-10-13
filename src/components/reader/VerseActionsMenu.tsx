"use client";

import { MoreHorizontal, Bookmark, MessageSquare, Share2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import React from "react";

interface VerseActionsMenuProps {
  verseNumber: number | string;
  verseText: string;
}

export const VerseActionsMenu = ({ verseNumber: _verseNumber, verseText: _verseText }: VerseActionsMenuProps) => {
  return (
    <div className="inline-flex items-center align-middle">
      <TooltipProvider delayDuration={200}>
        <div className="relative inline-flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6 p-0 cursor-pointer hover:bg-[#9B2C2C]">
                <Bookmark className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <span>Bookmark</span>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6 p-0 cursor-pointer hover:bg-[#9B2C2C]">
                <MessageSquare className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <span>Note</span>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6 p-0 cursor-pointer hover:bg-[#9B2C2C]">
                <Copy className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <span>Copy</span>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6 p-0 cursor-pointer hover:bg-[#9B2C2C]">
                <Share2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <span>Share</span>
            </TooltipContent>
          </Tooltip>

          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 p-0 md:opacity-0 md:group-hover:inline-flex md:group-hover:opacity-100 cursor-pointer hover:bg-[#9B2C2C]"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </TooltipProvider>
    </div>
  );
}


