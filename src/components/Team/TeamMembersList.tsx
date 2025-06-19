
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import TeamMemberCard from "./TeamMemberCard";
import TeamMemberForm from "./TeamMemberForm";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export interface TeamMember {
  id: string;
  name: string;
  bio: string;
  photo_url: string | null;
  promotion_title: string | null;
  promotion_description: string | null;
  promotion_photo_url: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
  promotions?: Array<{
    id?: string;
    title?: string;
    description?: string;
    photo_url?: string;
  }>;
}

const TeamMembersList = () => {
  const { isAdmin } = useAuth();
  const [showAddDialog, setShowAddDialog] = useState(false);

  const { data: teamMembers, isLoading, refetch } = useQuery({
    queryKey: ['team-members'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as TeamMember[];
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {isAdmin && (
        <div className="flex justify-center mb-8">
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Team Member
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Team Member</DialogTitle>
              </DialogHeader>
              <TeamMemberForm 
                onSuccess={() => {
                  setShowAddDialog(false);
                  refetch();
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      )}

      <div className="space-y-16">
        {teamMembers?.map((member, index) => (
          <TeamMemberCard
            key={member.id}
            member={member}
            isReversed={index % 2 === 1}
            onUpdate={refetch}
          />
        ))}
      </div>

      {(!teamMembers || teamMembers.length === 0) && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No team members found.</p>
          {isAdmin && (
            <p className="text-sm text-muted-foreground mt-2">
              Add the first team member to get started.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default TeamMembersList;
