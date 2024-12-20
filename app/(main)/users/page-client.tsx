"use client";

import React, {useEffect, useMemo, useState} from "react";
import {getUsersList, deleteUser} from "@/app/(main)/users/actions";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRight,
  ChevronsUpDownIcon,
  ChevronUpIcon,
  Loader,
  Loader2, Trash2
} from "lucide-react";
import {Input} from "@/components/ui/input";
import {toast} from "sonner";
import {User} from "@prisma/client";

type SortKey = 'name' | 'birthDate' | 'email'
type SortOrder = 'asc' | 'desc'

const PageClient = () => {
  const [usersList, setUsersList] = useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);

  const [searchTerm, setSearchTerm] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')

  const [loadingList , setLoadingList] = useState<string[]>([]);

  const [page, setPage] = useState<number>(0);

  useEffect(() => {
    const load = async () => {
      const result = await getUsersList(page);
      console.log(result);
      if (result.success){
        setUsersList(result.data!);
      }
      setLoading(false);
    }
    load();
  }, [page]);

  const handleDeleteUser = async (req: User) => {
    setLoadingList((prev) => [...prev , req.id]);
    try {
      const result = await deleteUser(req.id);
      if (result.success) {
        setUsersList((prev) => prev.filter((v) => v.id != req.id));
        toast("Approved successfully.", {
          description: `User "${req.firstName}" is now a deleted`,
          action: {
            label: "Ok",
            onClick: () => {
            },
          },
        })
      } else {
        toast("Failed", {
          description: `Reason: ${result.reason}`,
          action: {
            label: "Ok",
            onClick: () => {
            },
          },
        })
      }
    } catch (e) {
      toast("Error happened.", {
        description: `Details: ${e}`,
        action: {
          label: "Ok",
          onClick: () => {},
        },
      })
      console.error(e);
    }
    setLoadingList((prev) => prev.filter(k => k != req.id));
  }

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortOrder('asc')
    }
  }

  const filteredAndSortedData = useMemo(() => {
    return usersList
      .filter(user => {
        const name = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase()
        const email = user.EmailAddress.toLowerCase()
        const search = searchTerm.toLowerCase()
        return name.includes(search) || email.includes(search)
      })
      .sort((a, b) => {
        let aValue, bValue
        switch (sortKey) {
          case 'name':
            aValue = `${a.firstName || ''} ${a.lastName || ''}`.toLowerCase()
            bValue = `${b.firstName || ''} ${b.lastName || ''}`.toLowerCase()
            break
          case 'birthDate':
            aValue = a.BirthDate ? new Date(a.BirthDate).getTime() : 0
            bValue = a.BirthDate ? new Date(a.BirthDate).getTime() : 0
            break
          case 'email':
            aValue = a.EmailAddress.toLowerCase()
            bValue = b.EmailAddress.toLowerCase()
            break
        }
        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
        return 0
      })
  }, [usersList, searchTerm, sortKey, sortOrder])

  const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
    if (columnKey === sortKey) {
      return sortOrder === 'asc' ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />
    }
    return <ChevronsUpDownIcon className="w-4 h-4" />
  }

  if (loading) {
    return (
      <div className="flex flex-col content-center items-center w-full h-full justify-center">
        <Loader className={"w-6 h-6 animate-spin justify-center"}/>
        Loading ..
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search by name or email"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm"
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead onClick={() => handleSort('name')} className="cursor-pointer w-1/3">
              Name <SortIcon columnKey="name" />
            </TableHead>
            <TableHead onClick={() => handleSort('birthDate')} className="cursor-pointer w-1/6">
              Birth Date <SortIcon columnKey="birthDate" />
            </TableHead>
            <TableHead onClick={() => handleSort('email')} className="cursor-pointer w-1/3">
              Email Address <SortIcon columnKey="email" />
            </TableHead>
            <TableHead className={"w-1/3"}>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAndSortedData.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                {`${user.firstName || ''} ${user.lastName || ''}`.trim() || 'N/A'}
              </TableCell>
              <TableCell>
                {user.BirthDate
                  ? new Date(user.BirthDate).toLocaleDateString()
                  : 'N/A'}
              </TableCell>
              <TableCell>{user.EmailAddress}</TableCell>
              <TableCell>
                {(loadingList.find(k => k == user.id) != null) && (
                  <div className="flex space-x-2 py-2 w-full">
                    <Loader2 className={"w-6 h-6 animate-spin justify-center"} />
                    <span>Loading</span>
                  </div>
                )}
                {(loadingList.find(k => k == user.id) == null) && (
                  <div className="flex space-x-2">
                    <Button className={""} onClick={() => handleDeleteUser(user)} variant="outline">
                      <Trash2 className={"w-4 h-4"}/>
                      Delete
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className={"flex flex-row space-x-2"}>
        <Button size="icon" variant="outline" disabled={page == 0} onClick={() => {
          setPage((p) => p - 1)
        }}>
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>

        <Button size="icon" variant="outline" disabled={usersList.length != 100} onClick={() => {
          setPage((p) => p + 1)
        }}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
};

export default PageClient;