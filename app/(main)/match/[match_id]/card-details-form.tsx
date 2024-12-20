'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CardDetailsFormData, CardDetailsSchema } from '@/forms/card-form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {useState} from "react";
import {Loader2} from "lucide-react";
interface CardDetailsFormProps {
  onSubmit: (data: CardDetailsFormData) => Promise<void>
}

export default function CardDetailsForm({ onSubmit }: CardDetailsFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CardDetailsFormData>({
    resolver: zodResolver(CardDetailsSchema),
  })

  const handleFormSubmit = async (data: CardDetailsFormData) => {
    setIsSubmitting(true)
    setSubmitMessage('')

    try {
      await onSubmit(data)
      setSubmitMessage('Card details submitted successfully!')
      reset()
    } catch (error) {
      setSubmitMessage('An error occurred while submitting the form.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full border-0 p-0">
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              {...register('cardNumber')}
              placeholder="1234 5678 9012 3456"
            />
            {errors.cardNumber && (
              <p className="text-sm text-red-500">{errors.cardNumber.message}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expirationDate">Expiration Date</Label>
              <Input
                id="expirationDate"
                {...register('expirationDate')}
                placeholder="MM/YY"
              />
              {errors.expirationDate && (
                <p className="text-sm text-red-500">{errors.expirationDate.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                {...register('cvv')}
                placeholder="123"
              />
              {errors.cvv && (
                <p className="text-sm text-red-500">{errors.cvv.message}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="cardholderName">Cardholder Name</Label>
            <Input
              id="cardholderName"
              {...register('cardholderName')}
              placeholder="John Doe"
            />
            {errors.cardholderName && (
              <p className="text-sm text-red-500">{errors.cardholderName.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className={"px-4 py-0"}>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {
              isSubmitting && (
                <div>
                  <Loader2 className={'w-4 h-4 animate-spin'}/>
                </div>
              )
            }
            <span>
              Submit
            </span>
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
