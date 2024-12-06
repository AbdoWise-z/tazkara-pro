'use client'

import { useState, useMemo } from 'react'
import { Stadium } from '@prisma/client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { addStadium, editStadium, deleteStadium } from './actions'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {ArrowUpDown, Loader2, Trash2} from 'lucide-react'
import {StadiumFormData, stadiumSchema} from "@/forms/stadium-form";

interface StadiumListProps {
  stadiums: Stadium[]
}

type SortField = 'name' | 'rowCount' | 'columnCount'

export default function StadiumList({ stadiums: initialStadiums }: StadiumListProps) {
  const [stadiums, setStadiums] = useState(initialStadiums)
  const [isOpen, setIsOpen] = useState(false)
  const [editingStadium, setEditingStadium] = useState<Stadium | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [loading, setLoading] = useState(0)


  const { register, handleSubmit, reset, formState: { errors } } = useForm<StadiumFormData>({
    resolver: zodResolver(stadiumSchema),
    defaultValues: editingStadium || undefined,
  })

  const onSubmit = async (data: StadiumFormData) => {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value.toString())
    })

    setLoading((l) => l + 1)
    const result = editingStadium
      ? await editStadium(formData)
      : await addStadium(formData)

    if (result.success) {
      setIsOpen(false)
      setEditingStadium(null)
      reset()
      setStadiums(result.data!) // this is the ugliest way to do it btw, but meh
    } else {
      // Handle errors (you might want to display these errors to the user)
      console.error(result.errors)
    }

    setLoading((l) => l - 1)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this stadium?')) {
      setLoading((l) => l + 1)
      const result = await deleteStadium(id)

      if (result.success) {
        setStadiums(result.data!)
      }
      setLoading((l) => l - 1)
    }
  }

  const filteredAndSortedStadiums = useMemo(() => {
    return stadiums
      .filter(stadium => stadium.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => {
        if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1
        if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1
        return 0
      })
  }, [stadiums, searchTerm, sortField, sortDirection])

  const toggleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Stadium List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex justify-between items-center">
            <Dialog open={isOpen} onOpenChange={(open) => {
              setIsOpen(open)
              if (!open) {
                setEditingStadium(null)
                reset()
              }
            }}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingStadium(null)}>Add Stadium</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingStadium ? 'Edit Stadium' : 'Add Stadium'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                  {editingStadium && (
                    <input type="hidden" {...register('id')} />
                  )}
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name
                      </Label>
                      <div className="col-span-3">
                        <Input
                          id="name"
                          {...register('name')}
                          className={errors.name ? 'border-red-500' : ''}
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="rowCount" className="text-right">
                        Row Count
                      </Label>
                      <div className="col-span-3">
                        <Input
                          id="rowCount"
                          type="number"
                          {...register('rowCount', { valueAsNumber: true })}
                          className={errors.rowCount ? 'border-red-500' : ''}
                        />
                        {errors.rowCount && <p className="text-red-500 text-sm mt-1">{errors.rowCount.message}</p>}
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="columnCount" className="text-right">
                        Column Count
                      </Label>
                      <div className="col-span-3">
                        <Input
                          id="columnCount"
                          type="number"
                          {...register('columnCount', { valueAsNumber: true })}
                          className={errors.columnCount ? 'border-red-500' : ''}
                        />
                        {errors.columnCount && <p className="text-red-500 text-sm mt-1">{errors.columnCount.message}</p>}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit">Save</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
            <div className="flex flex-row flex-1 mx-2">
              {(loading != 0) && (
                <div className="flex flex-row items-center space-x-1">
                  <Loader2 className={"w-4 h-4 animate-spin"}/>
                  <span> Syncing ... </span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="search">Search:</Label>
              <Input
                id="search"
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead onClick={() => toggleSort('name')} className="cursor-pointer">
                  Name <ArrowUpDown className="inline ml-2" />
                </TableHead>
                <TableHead onClick={() => toggleSort('rowCount')} className="cursor-pointer">
                  Row Count <ArrowUpDown className="inline ml-2" />
                </TableHead>
                <TableHead onClick={() => toggleSort('columnCount')} className="cursor-pointer">
                  Column Count <ArrowUpDown className="inline ml-2" />
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedStadiums.map((stadium) => (
                <TableRow key={stadium.id}>
                  <TableCell>{stadium.name}</TableCell>
                  <TableCell>{stadium.rowCount}</TableCell>
                  <TableCell>{stadium.columnCount}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingStadium(stadium)
                          reset(stadium)
                          setIsOpen(true)
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(stadium.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  )
}

