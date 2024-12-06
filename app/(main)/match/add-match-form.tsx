'use client'

import React, {useEffect, useState} from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {Match, Stadium} from "@prisma/client"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {MatchFormData, matchSchema} from "@/forms/match-form";


interface AddMatchFormProps {
  onAdd: (newMatch: Match) => void
  stadiums: Stadium[],
  match?: Match,
  children?: React.ReactNode | null,
}

export function AddMatchForm({ onAdd, stadiums, match, children }: AddMatchFormProps) {
  const [open, setOpen] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<MatchFormData>({
    resolver: zodResolver(matchSchema),
    defaultValues: {
      homeTeam: '',
      awayTeam: '',
      date: new Date(Date.now() + 86400000), // Tomorrow
      mainReferee: '',
      linesMen: ['', ''],
      stadiumId: '',
    }
  })

  useEffect(() => {
    if (match) {
      setValue('homeTeam', match.homeTeam);
      setValue('awayTeam', match.awayTeam);
      setValue('date', match.date);
      console.log(match.date);
      setValue('mainReferee', match.mainReferee);
      setValue('linesMen', [match.linesMen[0], match.linesMen[1]]);
      setValue('stadiumId', match.stadiumId);
    }
  }, [open, match, setValue]);

  const onSubmit = (data: MatchFormData) => {
    onAdd({
      ...data,
      id: match?.id ?? "",
    })
    reset()
    setOpen(false)
  }

  const trigger = children ?? <Button className="mb-4">Add New Match</Button>

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{match != null ? "Edit " : "Add New "} Match</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="homeTeam">Home Team</Label>
              <Input
                id="homeTeam"
                {...register('homeTeam')}
                className={errors.homeTeam ? "border-red-500" : ""}
              />
              {errors.homeTeam && (
                <p className="text-sm text-red-500">{errors.homeTeam.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="awayTeam">Away Team</Label>
              <Input
                id="awayTeam"
                {...register('awayTeam')}
                className={errors.awayTeam ? "border-red-500" : ""}
              />
              {errors.awayTeam && (
                <p className="text-sm text-red-500">{errors.awayTeam.message}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Date & Time</Label>
            <Input
              id="date"
              type="datetime-local"
              {...register('date', {
                setValueAs: (value) => value ? new Date(value) : undefined,
              })}
              className={errors.date ? "border-red-500" : ""}
            />
            {errors.date && (
              <p className="text-sm text-red-500">{errors.date.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="stadiumId">Stadium</Label>
            <Select
              value={watch('stadiumId')}
              onValueChange={(value) => setValue('stadiumId', value)}
            >
              <SelectTrigger className={errors.stadiumId ? "border-red-500" : ""}>
                <SelectValue placeholder="Select a stadium" />
              </SelectTrigger>
              <SelectContent>
                {stadiums.map((stadium) => (
                  <SelectItem key={stadium.id} value={stadium.id}>{stadium.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.stadiumId && (
              <p className="text-sm text-red-500">{errors.stadiumId.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="mainReferee">Main Referee</Label>
            <Input
              id="mainReferee"
              {...register('mainReferee')}
              className={errors.mainReferee ? "border-red-500" : ""}
            />
            {errors.mainReferee && (
              <p className="text-sm text-red-500">{errors.mainReferee.message}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="linesMen.0">Linesman 1</Label>
              <Input
                id="linesMen.0"
                {...register('linesMen.0')}
                className={errors.linesMen?.[0] ? "border-red-500" : ""}
              />
              {errors.linesMen?.[0] && (
                <p className="text-sm text-red-500">{errors.linesMen[0].message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="linesMen.1">Linesman 2</Label>
              <Input
                id="linesMen.1"
                {...register('linesMen.1')}
                className={errors.linesMen?.[1] ? "border-red-500" : ""}
              />
              {errors.linesMen?.[1] && (
                <p className="text-sm text-red-500">{errors.linesMen[1].message}</p>
              )}
            </div>
          </div>
          <Button type="submit" className="w-full">{match != null ? "Save" : "Add Match"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}