"use client";

import React, {useEffect} from 'react';
import {MatchCard} from "@/app/(main)/match/match-card";
import {MatchWReservationsCountWStadium} from "@/app/(main)/match/types";
import {createMatch, deleteMatch, getAllStadiums, getMatches, updateMatch} from "@/app/(main)/match/actions";
import {Loader2, Plus} from "lucide-react";
import {AddMatchForm} from "@/app/(main)/match/add-match-form";
import {Match, Stadium} from "@prisma/client";
import {toast} from "sonner";
import {Button} from "@/components/ui/button";

const MatchesPage = (
  {isAdmin} : {
    isAdmin: boolean,
  }
) => {
  const [loading, setLoading] = React.useState(0);
  const [matches, setMatches] = React.useState<MatchWReservationsCountWStadium[]>([]);
  const [stadiums, setStadiums] = React.useState<Stadium[]>([]);

  const handleEdit = async (m: Match) => {
    setLoading((l) => l + 1);
    const result = await updateMatch(m);
    setLoading((l) => l - 1);

    console.log(result);
    if (result.success) {
      toast("Match details changed", {
        description: `Note that any reservations will be discarded!`,
        action: {
          label: "Ok",
          onClick: () => {
          },
        },
      })
      setMatches(result.data!);
    } else {
      if (!result.fatal) {
        toast("Failed to edit match", {
          description: `Reason: ${result.reason}`,
          action: {
            label: "Ok",
            onClick: () => {
            },
          },
        })
      } else {
        console.log(result);
      }
    }

  }


  const handleDelete = async (m: Match) => {
    if (confirm("Are you sure you want to delete this match ?")) {
      setLoading((l) => l + 1);
      const result = await deleteMatch(m);
      setLoading((l) => l - 1);

      if (result.success) {
        toast("Match deleted", {
          description: `Note that any reservations will be discarded!`,
          action: {
            label: "Ok",
            onClick: () => {
            },
          },
        })
        setMatches(result.data!);
      } else {
        toast("Failed to delete match", {
          description: `This match doesn't exist`,
          action: {
            label: "Ok",
            onClick: () => {
            },
          },
        })
      }
    }
  }

  const handleAdd = async (m: Match) => {
    setLoading((l) => l + 1);
    const result = await createMatch(m);
    setLoading((l) => l - 1);

    if (result.success) {
      setMatches(result.data!);
    } else {
      if (!result.fatal) {
        toast("Failed to create a match", {
          description: `Reason: ${result.reason}`,
          action: {
            label: "Ok",
            onClick: () => {
            },
          },
        })
      }
    }

  }

  useEffect(() => {
    const load_data = async () => {
      setLoading((l) => l + 1);
      setMatches(await getMatches())
      const st = await getAllStadiums();
      if (st.success) {
        setStadiums(st.data!)
      }
      setLoading((l) => l - 1);
    }
    
    load_data();
  }, []);

  return (
    <div className={"flex flex-col w-full flex-1 items-center overflow-none"}>

      <div className={"flex flex-col w-full flex-1 items-center overflow-y-auto"}>
        {matches.map((i, index) => {
          return <MatchCard key={index} match={i} enabledEdit={isAdmin} onEditAction={handleEdit} enableDelete={isAdmin}
                            onDeleteAction={handleDelete} stadiums={stadiums}/>
        })}

      </div>

      <div className={"flex flex-row w-full items-center content-center justify-end gap-2"}>
        {(loading != 0) && (
          <div className="flex flex-row items-center space-x-1">
            <Loader2 className={"w-4 h-4 animate-spin"}/>
            <span> Syncing </span>
          </div>
        )}

        {isAdmin &&
          <AddMatchForm onAdd={handleAdd} stadiums={stadiums}>
            <Button className={"rounded-full"}>
              <Plus className="mr-2 w-4 h-4"/>
              <span>Add match</span>
            </Button>
          </AddMatchForm>
        }
      </div>
    </div>
  );
};

export default MatchesPage;