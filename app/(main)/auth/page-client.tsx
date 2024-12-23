"use client";

import React, {useEffect, useMemo, useState} from "react";
import {AuthorizationWithUser} from "@/app/(main)/auth/types";
import {approveAuthRequest, getAuthRequests, rejectAuthRequest} from "@/app/(main)/auth/actions";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import {ChevronDownIcon, ChevronsUpDownIcon, ChevronUpIcon, Loader, Loader2} from "lucide-react";
import {Input} from "@/components/ui/input";
import {toast} from "sonner";

type SortKey = 'name' | 'birthDate' | 'email'
type SortOrder = 'asc' | 'desc'

const PageClient = () => {
  const [authRequests, setAuthRequests] = useState<AuthorizationWithUser[]>([]);
  const [loading, setLoading] = React.useState(true);

  const [searchTerm, setSearchTerm] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')

  const [loadingList , setLoadingList] = useState<string[]>([]);

  useEffect(() => {
    const load = async () => {
      const result = await getAuthRequests();
      console.log(result);
      if (result.success){
        setAuthRequests(result.data!);
      }
      setLoading(false);
    }
    load();
  }, []);

  const handleApprove = async (req: AuthorizationWithUser) => {
    setLoadingList((prev) => [...prev , req.id]);
    try {
      const result = await approveAuthRequest(req.id);
      if (result.success) {
        toast("Approved successfully.", {
          description: `User "${req.user.firstName}" is now a manager`,
          action: {
            label: "Ok",
            onClick: () => {
            },
          },
        })
        setAuthRequests((prev) => prev.filter((v) => v.id != req.id))
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

  const handleReject = async (req: AuthorizationWithUser) => {
    setLoadingList((prev) => [...prev , req.id]);
    try {
      const result = await rejectAuthRequest(req.id);
      if (result.success) {
        toast("Rejected successfully.", {
        })
        setAuthRequests((prev) => prev.filter((v) => v.id != req.id))
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
    return authRequests
      .filter(entry => {
        const name = `${entry.user.firstName || ''} ${entry.user.lastName || ''}`.toLowerCase()
        const email = entry.user.EmailAddress.toLowerCase()
        const search = searchTerm.toLowerCase()
        return name.includes(search) || email.includes(search)
      })
      .sort((a, b) => {
        let aValue, bValue
        switch (sortKey) {
          case 'name':
            aValue = `${a.user.firstName || ''} ${a.user.lastName || ''}`.toLowerCase()
            bValue = `${b.user.firstName || ''} ${b.user.lastName || ''}`.toLowerCase()
            break
          case 'birthDate':
            aValue = a.user.BirthDate ? new Date(a.user.BirthDate).getTime() : 0
            bValue = b.user.BirthDate ? new Date(b.user.BirthDate).getTime() : 0
            break
          case 'email':
            aValue = a.user.EmailAddress.toLowerCase()
            bValue = b.user.EmailAddress.toLowerCase()
            break
        }
        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
        return 0
      })
  }, [authRequests, searchTerm, sortKey, sortOrder])

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
          {filteredAndSortedData.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>
                {`${entry.user.firstName || ''} ${entry.user.lastName || ''}`.trim() || 'N/A'}
              </TableCell>
              <TableCell>
                {entry.user.BirthDate
                  ? new Date(entry.user.BirthDate).toLocaleDateString()
                  : 'N/A'}
              </TableCell>
              <TableCell>{entry.user.EmailAddress}</TableCell>
              <TableCell>
                {(loadingList.find(k => k == entry.id) != null) && (
                  <div className="flex space-x-2 py-2 w-full">
                    <Loader2 className={"w-6 h-6 animate-spin justify-center"} />
                    <span>Loading</span>
                  </div>
                )}
                {(loadingList.find(k => k == entry.id) == null) && (
                  <div className="flex space-x-2">
                    <Button onClick={() => handleApprove(entry)} variant="outline">
                      Approve
                    </Button>
                    <Button onClick={() => handleReject(entry)} variant="outline">
                      Reject
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
};

export default PageClient;