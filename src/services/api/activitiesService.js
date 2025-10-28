import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

const activityTypes = ["Call", "Email", "Meeting", "Task", "Note"];

export const activitiesService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('activity_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "dueDate_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "createdAt_c"}},
          {"field": {"name": "contactId_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"name": "dealId_c"}, "referenceField": {"field": {"Name": "Name"}}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching activities:", error?.message || error);
      toast.error("Failed to load activities");
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.getRecordById('activity_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "dueDate_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "createdAt_c"}},
          {"field": {"name": "contactId_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"name": "dealId_c"}, "referenceField": {"field": {"Name": "Name"}}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Activity not found");
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching activity ${id}:`, error?.message || error);
      throw error;
    }
  },

  async create(activityData) {
    try {
      const apperClient = getApperClient();
      const payload = {
        type_c: activityData.type_c,
        subject_c: activityData.subject_c,
        description_c: activityData.description_c,
        dueDate_c: activityData.dueDate_c,
        completed_c: activityData.completed_c || false,
        createdAt_c: new Date().toISOString()
      };

      if (activityData.contactId_c) {
        payload.contactId_c = parseInt(activityData.contactId_c);
      }

      if (activityData.dealId_c) {
        payload.dealId_c = parseInt(activityData.dealId_c);
      }

      const response = await apperClient.createRecord('activity_c', {
        records: [payload]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Failed to create activity");
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to create activity: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to create activity");
        }
        return response.results[0].data;
      }

      return response.data;
    } catch (error) {
      console.error("Error creating activity:", error?.message || error);
      throw error;
    }
  },

  async update(id, activityData) {
    try {
      const apperClient = getApperClient();
      const payload = {
        Id: parseInt(id),
        type_c: activityData.type_c,
        subject_c: activityData.subject_c,
        description_c: activityData.description_c,
        dueDate_c: activityData.dueDate_c,
        completed_c: activityData.completed_c
      };

      if (activityData.contactId_c) {
        payload.contactId_c = parseInt(activityData.contactId_c);
      }

      if (activityData.dealId_c) {
        payload.dealId_c = parseInt(activityData.dealId_c);
      }

      const response = await apperClient.updateRecord('activity_c', {
        records: [payload]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Failed to update activity");
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to update activity: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to update activity");
        }
        return response.results[0].data;
      }

      return response.data;
    } catch (error) {
      console.error("Error updating activity:", error?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.deleteRecord('activity_c', {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to delete activity: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error("Error deleting activity:", error?.message || error);
      return false;
    }
  },

  async getByContactId(contactId) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('activity_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "dueDate_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "createdAt_c"}},
          {"field": {"name": "contactId_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"name": "dealId_c"}, "referenceField": {"field": {"Name": "Name"}}}
        ],
        where: [{
          FieldName: "contactId_c",
          Operator: "EqualTo",
          Values: [parseInt(contactId)]
        }]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching activities by contact:", error?.message || error);
      return [];
    }
  },

  async getByDealId(dealId) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('activity_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "dueDate_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "createdAt_c"}},
          {"field": {"name": "contactId_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"name": "dealId_c"}, "referenceField": {"field": {"Name": "Name"}}}
        ],
        where: [{
          FieldName: "dealId_c",
          Operator: "EqualTo",
          Values: [parseInt(dealId)]
        }]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching activities by deal:", error?.message || error);
      return [];
    }
  },

  async markCompleted(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.updateRecord('activity_c', {
        records: [{
          Id: parseInt(id),
          completed_c: true
        }]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Failed to mark activity as completed");
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to mark activity as completed: ${JSON.stringify(failed)}`);
          throw new Error("Failed to mark activity as completed");
        }
        return response.results[0].data;
      }

      return response.data;
    } catch (error) {
      console.error("Error marking activity as completed:", error?.message || error);
      throw error;
    }
  },

  async getUpcoming(limit = 10) {
    try {
      const activities = await this.getAll();
      const now = new Date();
      
      return activities
        .filter(activity => !activity.completed_c && new Date(activity.dueDate_c) >= now)
        .sort((a, b) => new Date(a.dueDate_c) - new Date(b.dueDate_c))
        .slice(0, limit);
    } catch (error) {
      console.error("Error fetching upcoming activities:", error?.message || error);
      return [];
    }
  },

  async getOverdue() {
    try {
      const activities = await this.getAll();
      const now = new Date();
      
      return activities.filter(activity =>
        !activity.completed_c && new Date(activity.dueDate_c) < now
      );
    } catch (error) {
      console.error("Error fetching overdue activities:", error?.message || error);
      return [];
    }
  },

  getActivityTypes() {
    return [...activityTypes];
  }
};