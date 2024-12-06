"use client";

import React, {useEffect} from 'react';
import {MatchWithTickets} from "@/app/(main)/tickets/types";
import {getMatchesWithReservations, removeReservation} from "@/app/(main)/tickets/actions";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {format} from "date-fns";
import {Loader, Loader2, MapPin, Trash2, Users} from "lucide-react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table';
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {useRouter} from "next/navigation";

const PageClient = () => {
  const [reservations, setReservations] = React.useState<MatchWithTickets[]>([]);
  const [deletingTickets, setDeletingTickets] = React.useState<string[]>([]);
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const load = async () => {
      const result = await getMatchesWithReservations();
      console.log(result);
      if (result.success){
        setReservations(result.data!);
      }
      setLoading(false);
    }
    load();
  }, []);
  const deleteTicket = async (reservationId: string, ticketId: string, seatIndex: number) => {
    setDeletingTickets((prev) => [...prev, ticketId]);
    try {
      const result = await removeReservation(reservationId , seatIndex);
      if (result.success) {
        setReservations(prevReservations =>
          prevReservations.map(reservation =>
            reservation.id === reservationId
              ? {...reservation, tickets: reservation.tickets.filter(ticket => ticket.id !== ticketId)}
              : reservation
          )
        )
      }
    } catch (e) {
      console.error(e);
    }

    setDeletingTickets((prev) => prev.filter((k) => k != ticketId));
  }

  if (loading) {
    return (
      <div className="flex flex-col content-center items-center w-full h-full justify-center">
        <Loader className={"w-6 h-6 animate-spin justify-center"}/>
        Loading ..
      </div>
    );
  }

  if (reservations.length == 0) {
    return <p>Seems like you didn't do any reservation.</p>
  }

  return (
    <div className="container mx-auto p-4">
      {reservations.map(reservation => (
        <Card key={reservation.id} className="mb-8">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            <CardTitle className="text-2xl w-full flex">
              <span>
                {reservation.homeTeam} vs {reservation.awayTeam}
              </span>
              <div className="flex flex-row flex-1"/>
              <Button className={"border-2 border-background font-bold"} variant={"ghost"} onClick={() => {
                router.push(`/match/${reservation.id}`)
              }}>
                See match page
              </Button>
            </CardTitle>
            <CardDescription className="text-gray-100">
              {format(reservation.date, 'EEEE, MMMM d, yyyy')} at {format(reservation.date, 'h:mm a')}
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center">
                <MapPin className="mr-2" />
                <span><strong>Stadium:</strong> {reservation.stadium.name}</span>
              </div>
              <div className="flex items-center">
                <span><strong>Main Referee:</strong> {reservation.mainReferee}</span>
              </div>
              <div className="flex items-center col-span-full">
                <Users className="mr-2" />
                <span><strong>Linesmen:</strong> {reservation.linesMen.join(', ')}</span>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-4">Tickets</h3>
            <Table className={"max-h-[50%] overflow-auto"}>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket ID</TableHead>
                  <TableHead>Seat</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reservation.tickets.map(ticket => (
                  <TableRow key={ticket.id}>
                    <TableCell>{ticket.id}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">Seat {ticket.seatIndex}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        disabled={deletingTickets.find((k) => k == ticket.id) != null}
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteTicket(reservation.id, ticket.id, ticket.seatIndex)}
                      >
                        { (deletingTickets.find((k) => k == ticket.id) == null) &&
                          ( <>
                            <Trash2 className="h-4 w-4 mr-1" />
                            Cancel
                          </>
                          )
                        }

                        { (deletingTickets.find((k) => k == ticket.id) != null) &&
                          ( <>
                              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                              Cancel
                            </>
                          )
                        }

                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {reservation.tickets.length === 0 && (
              <p className="text-center text-gray-500 mt-4">No tickets available for this match.</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PageClient;