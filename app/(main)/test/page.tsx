"use client"

import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import React, {Component} from 'react';

export default function DateSelectorDemo() {
  const [currentDate, setCurrentDate] = useState<string>('2023-06-15')

  const handleDateChange = (newDate: string) => {
    setCurrentDate(newDate)
    console.log(`Date changed to: ${newDate}`)
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Date Selector Demo</h1>
      <DateSelector
        initialValue={currentDate}
        onChange={handleDateChange}
        label="Choose a date:"
      />
      <p className="mt-4">
        Current date in parent component: {currentDate || 'No date selected'}
      </p>
    </div>
  )
}

export function DateSelector({ initialValue = '', onChange, label = 'Select a date:' }) {
  const [selectedDate, setSelectedDate] = useState<string>(initialValue)

  useEffect(() => {
    setSelectedDate(initialValue)
  }, [initialValue])

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = event.target.value
    const v = new Date(newDate)
    console.log(`Date to: ${v.toLocaleDateString()}`)
    setSelectedDate(newDate)
    onChange(newDate)
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Date Selector</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date-input">{label}</Label>
            <Input
              id="date-input"
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
            />
          </div>
          <div className="pt-4 border-t">
            <p className="text-sm font-medium text-gray-500">Selected Date:</p>
            <p className="text-lg font-semibold">
              {selectedDate ? new Date(selectedDate).toLocaleDateString() : 'No date selected'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

