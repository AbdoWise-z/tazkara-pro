'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {ChevronDown, ChevronUp, Calendar, MapPin, Edit2, Trash2} from 'lucide-react'
import {MatchWReservationsCountWStadium} from "@/app/(main)/match/types";
import {Match, Stadium} from "@prisma/client";
import {AddMatchForm} from "@/app/(main)/match/add-match-form";
import {useRouter} from "next/navigation";

interface MatchCardProps {
  match: MatchWReservationsCountWStadium,
  onEditAction: (m: Match) => void;
  onDeleteAction: (m: Match) => void;
  enabledEdit: boolean;
  enableDelete: boolean;
  stadiums: Stadium[];
}

export function MatchCard({ match, onDeleteAction, onEditAction, enabledEdit, enableDelete, stadiums }: MatchCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const router = useRouter()
  const toggleExpand = () => setIsExpanded(!isExpanded)

  const isFullyReserved = match.reservations >= match.maxReservations
  const reservationPercentage = useMemo(() =>
      (match.reservations / match.maxReservations) * 100,
    [match.reservations, match.maxReservations]
  )

  const isHighDemand = reservationPercentage > 60

  return (
    <Card className={`w-full max-w-[70%] mb-6 overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ${isHighDemand ? 'border-l-4 border-l-orange-500' : ''}`}>
      <CardHeader className="p-6 bg-background dark:bg-gray-800">
        <div className="flex flex-col space-y-4">
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
                <Calendar className="w-5 h-5" />
                <span className="text-sm">{new Date(match.date).toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span className="text-sm">{match.stadium.name}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {enabledEdit &&
                <AddMatchForm onAdd={onEditAction} stadiums={stadiums} match={match}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                    aria-controls={`match-details-${match.id}`}
                  >
                    <Edit2 className="w-6 h-6" aria-hidden="true" />
                  </Button>
                </AddMatchForm>
              }

              {enableDelete &&
                <Button
                  onClick={() => onDeleteAction(match)}
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                  aria-controls={`match-details-${match.id}`}
                >
                  <Trash2 className="w-6 h-6" aria-hidden="true" />
                </Button>
              }

              <Button
                variant="ghost"
                size="sm"
                onClick={toggleExpand}
                className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                aria-expanded={isExpanded}
                aria-controls={`match-details-${match.id}`}
              >
                {isExpanded ? <ChevronUp className="w-6 h-6" aria-hidden="true" /> : <ChevronDown className="w-6 h-6" aria-hidden="true" />}
                <span className="sr-only">{isExpanded ? 'Hide' : 'Show'} match details</span>
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent
        id={`match-details-${match.id}`}
        className={`bg-gray-50 dark:bg-gray-900 transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-96 py-6' : 'max-h-0 py-0'
        } overflow-hidden`}
      >
        {isExpanded && (
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
                    style={{ width: `${reservationPercentage}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 inline">
                  {match.reservations} / {match.maxReservations}
                </span>
              </div>
            </div>
            <Button
              className="w-full bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-600 dark:hover:bg-blue-700"
              disabled={isFullyReserved}
              onClick={() => {
                router.push(`/match/${match.id}`)
              }}
            >
              {isFullyReserved ? 'Fully Reserved' : 'Reserve a Seat'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

