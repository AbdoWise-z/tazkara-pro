"use client";

import React, {useState} from 'react';
import {MatchWithStadiumWithReservations} from "@/app/(main)/match/[match_id]/types";
import {Calendar, MapPin, Minus, Plus} from "lucide-react";
import {range} from "d3-array";
import {useFloatingWindow} from "@/components/providers/floating-window-provider";
import {useUser} from "@/components/providers/current-user-provider";
import {cn} from "@/lib/utils";
import {addReservations} from "@/app/(main)/match/[match_id]/actions";
import {Button} from "@/components/ui/button";
import {
  Drawer, DrawerClose,
  DrawerContent,
  DrawerDescription, DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer';
import CardDetailsForm from "@/app/(main)/match/[match_id]/card-details-form";
import {useRouter} from "next/navigation";
import {toast} from "sonner";

const InteractiveMatchPage = (
  {match} : {match: MatchWithStadiumWithReservations}
) => {

  const reservations = match.Reservations.length;
  const maxReservations = match.stadium.rowCount * match.stadium.columnCount;
  const reservationPercentage = reservations / maxReservations * 100;
  const isHighDemand = reservationPercentage > 60;
  const floatingWindow = useFloatingWindow();
  const { user } = useUser();
  const router = useRouter();
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);

  const [loading, setLoading] = React.useState<number[][]>([]);

  const handleCellClick = async (row: number, column: number, action: "CancelReservation" | "Reserve") => {
    if (action == "Reserve") {
      setLoading((l) => [...l , [row, column]]);
    } else {
      setLoading((l) => l.filter(k => !(k[0] == row && k[1] == column)));
    }
  }

  const handleSubmit = async () => {
    if (user == null || user.id == null) {
      toast("Woah, who are you ?", {
        duration: 6000,
        description: `Seems like you're not signed in, sign in ?`,
        action: {
          label: "Sign in",
          onClick: () => {
            router.push("/sign-in")
          },
        },
      })
      setOpenDrawer(false);
    } else {
      const seats = loading.map((k) => k[1] + k[0] * match.stadium.columnCount)
      const result = await addReservations(match.id, seats)

      if (result.success) {
        console.log(seats, result.data)
        if (seats.length == result.data?.length) {
          toast("All set", {
            duration: 2000,
            description: `Reservations has been complete`,
            action: {
              label: "Lesgo",
              onClick: () => {
              },
            },
          })
        } else {
          toast("Booked the seats", {
            duration: 2000,
            description: `but some of them were booked by other people in the process :|`,
            action: {
              label: "Ok",
              onClick: () => {},
            },
          })
        }
        setLoading([]);
      } else {
        toast("Booking failed!", {
          duration: 2000,
          description: `${result.reason}`,
        })
      }

      setOpenDrawer(false);
    }
  }

  return (
    <div className="flex flex-col space-y-4 p-20 w-full max-w-[80%]">
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center space-x-4 flex-1">
          <div
            className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 font-bold text-lg"
            aria-hidden="true"
          >
            {match.homeTeam.charAt(0)}
          </div>
          <span className="text-xl font-medium text-gray-800 dark:text-gray-200">{match.homeTeam}</span>
        </div>
        <div className="flex-none px-4">
          <span className="text-2xl font-bold text-gray-500 dark:text-gray-400">VS</span>
        </div>
        <div className="flex items-center space-x-4 flex-1 justify-end">
          <span className="text-xl font-medium text-gray-800 dark:text-gray-200">{match.awayTeam}</span>
          <div
            className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 font-bold text-lg"
            aria-hidden="true"
          >
            {match.awayTeam.charAt(0)}
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center w-full text-gray-600 dark:text-gray-400">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5"/>
            <span className="text-sm">{new Date(match.date).toLocaleString()}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5"/>
            <span className="text-sm">{match.stadium.name}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium text-gray-700 dark:text-gray-300">Main Referee</h3>
            <p className="text-gray-600 dark:text-gray-400">{match.mainReferee}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-700 dark:text-gray-300">Linesmen</h3>
            <p className="text-gray-600 dark:text-gray-400">{match.linesMen.join(', ')}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-sm">
          <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Reservations</h3>
          <div className="flex items-center justify-between">
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-4">
              <div
                className={`h-2 rounded-full ${isHighDemand ? 'bg-orange-500' : 'bg-blue-500'}`}
                style={{width: `${reservationPercentage}%`}}
              ></div>
            </div>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 inline">
                  {reservations} / {maxReservations}
                </span>
          </div>
        </div>
      </div>

      <div className={"flex flex-col gap-2 w-full content-center items-center p-2"}>
        <div className={'w-full flex justify-between items-center p-2'}>
          <span className="text-sm font-bold">
            Seats
          </span>

          <Drawer onOpenChange={(o) => {
            setOpenDrawer(o);
          }} open={openDrawer}>
            <DrawerTrigger asChild>
              <Button variant="outline" className={
                cn(
                  "ml-auto transition-all",
                  loading.length != 0 && "border-green-600"
                )
              } disabled={loading.length == 0}>Submit reservations</Button>
            </DrawerTrigger>
            <DrawerContent>
              <div className="mx-auto w-full max-w-md">
                <DrawerHeader>
                  <DrawerTitle>Confirm Purchases</DrawerTitle>
                  <DrawerDescription>Please enter you cards details to conform the seats purchase.</DrawerDescription>
                </DrawerHeader>
                <CardDetailsForm onSubmit={
                  async (v) => {
                    await handleSubmit()
                  }
                }/>
                <DrawerFooter>
                  <DrawerClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DrawerClose>
                </DrawerFooter>
              </div>
            </DrawerContent>
          </Drawer>

        </div>
        <div className="flex space-x-4">
          <div className="flex flex-col gap-2 w-full content-center items-center">
            {range(0, match.stadium.rowCount).map((row) => (
              <div key={`row-${row}`} className={"flex flex-row gap-2"}>
                {
                  range(0, match.stadium.columnCount).map((column) => {
                    const mIndex = row * match.stadium.columnCount + column;
                    const reservation = match.Reservations.find((i: { seatIndex: number; }) => i.seatIndex == mIndex);

                    const color =
                      loading.find((k) => k[0] == row && k[1] == column) != null ? "bg-yellow-500" :
                        reservation == null ? "bg-gray-600" :
                          reservation.userId == user?.id ? "bg-green-600" :
                            "bg-red-600";

                    const text =
                      loading.find((k) => k[0] == row && k[1] == column) != null ? "Waiting for confirmation" :
                        reservation == null ? "Empty seat" :
                          reservation.userId == user?.id ? "You own this" :
                            "Someone else booked this";

                    return (
                      <div key={`cell-${row}-${column}`} className={cn(
                        "w-8 h-8 ",
                        color
                      )}
                           onMouseEnter={() => {
                             floatingWindow.showFloatingWindow((
                               <div
                                 className={"flex flex-row gap-2 bg-background border-foreground border-2 p-3 rounded-md"}>
                                 {text}
                               </div>
                             ), "top")
                           }}
                           onMouseLeave={() => {
                             floatingWindow.hideFloatingWindow();
                           }}

                           onClick={() => {
                             if (reservation == null)
                               handleCellClick(row, column, reservation == null && loading.find((k) => k[0] == row && k[1] == column) == null ? "Reserve" : "CancelReservation")
                           }}
                      >
                      </div>
                    )
                  })
                }
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default InteractiveMatchPage;