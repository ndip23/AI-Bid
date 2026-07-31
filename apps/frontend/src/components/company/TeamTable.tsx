'use client';

import React from 'react';
import { User } from '../../types';
import { Card, CardHeader, Badge } from '../ui';
import { Users, Mail } from 'lucide-react';

interface TeamTableProps {
  users?: User[];
}

export const TeamTable: React.FC<TeamTableProps> = ({ users = [] }) => {
  return (
    <Card padding="lg">
      <CardHeader
        title="Team Members & Portal Access"
        description="Users associated with this company profile who can manage saved bids"
        icon={<Users className="w-5 h-5 text-blue-600" />}
      />

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 uppercase font-bold">
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-800">
            {users.length > 0 ? (
              users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors font-medium">
                  <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-extrabold text-xs">
                      {u.firstName[0]}
                      {u.lastName[0]}
                    </div>
                    <span>
                      {u.firstName} {u.lastName}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>{u.email}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={u.role === 'SUPER_ADMIN' ? 'purple' : 'indigo'} size="sm">
                      {u.role.replace('_', ' ')}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="success" size="sm" dot>
                      Active
                    </Badge>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-6 text-center text-slate-500 italic">
                  No additional team members added.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
