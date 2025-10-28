import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

const dealStages = ["Lead", "Qualified", "Proposal", "Negotiation", "Closed Won", "Closed Lost"];

export const dealsService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('deal_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "probability_c"}},
          {"field": {"Name": "closeDate_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "createdAt_c"}},
          {"field": {"name": "contactId_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"name": "companyId_c"}, "referenceField": {"field": {"Name": "Name"}}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching deals:", error?.message || error);
      toast.error("Failed to load deals");
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.getRecordById('deal_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "probability_c"}},
          {"field": {"Name": "closeDate_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "createdAt_c"}},
          {"field": {"name": "contactId_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"name": "companyId_c"}, "referenceField": {"field": {"Name": "Name"}}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Deal not found");
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching deal ${id}:`, error?.message || error);
      throw error;
    }
  },

  async create(dealData) {
    try {
      const apperClient = getApperClient();
      const payload = {
        title_c: dealData.title_c,
        value_c: parseFloat(dealData.value_c),
        stage_c: dealData.stage_c,
        probability_c: parseInt(dealData.probability_c),
        closeDate_c: dealData.closeDate_c,
        contactId_c: parseInt(dealData.contactId_c),
        companyId_c: parseInt(dealData.companyId_c),
        notes_c: dealData.notes_c || "",
        createdAt_c: new Date().toISOString()
      };

      const response = await apperClient.createRecord('deal_c', {
        records: [payload]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Failed to create deal");
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to create deal: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to create deal");
        }
        return response.results[0].data;
      }

      return response.data;
    } catch (error) {
      console.error("Error creating deal:", error?.message || error);
      throw error;
    }
  },

  async update(id, dealData) {
    try {
      const apperClient = getApperClient();
      const payload = {
        Id: parseInt(id),
        title_c: dealData.title_c,
        value_c: parseFloat(dealData.value_c),
        stage_c: dealData.stage_c,
        probability_c: parseInt(dealData.probability_c),
        closeDate_c: dealData.closeDate_c,
        contactId_c: parseInt(dealData.contactId_c),
        companyId_c: parseInt(dealData.companyId_c),
        notes_c: dealData.notes_c || ""
      };

      const response = await apperClient.updateRecord('deal_c', {
        records: [payload]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Failed to update deal");
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to update deal: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to update deal");
        }
        return response.results[0].data;
      }

      return response.data;
    } catch (error) {
      console.error("Error updating deal:", error?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.deleteRecord('deal_c', {
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
          console.error(`Failed to delete deal: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error("Error deleting deal:", error?.message || error);
      return false;
    }
  },

  async updateStage(id, newStage) {
    if (!dealStages.includes(newStage)) {
      throw new Error("Invalid deal stage");
    }

    try {
      const apperClient = getApperClient();
      const payload = {
        Id: parseInt(id),
        stage_c: newStage,
        probability_c: newStage === "Closed Won" ? 100 : newStage === "Closed Lost" ? 0 : undefined
      };

      const response = await apperClient.updateRecord('deal_c', {
        records: [payload]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Failed to update deal stage");
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to update deal stage: ${JSON.stringify(failed)}`);
          throw new Error("Failed to update deal stage");
        }
        return response.results[0].data;
      }

      return response.data;
    } catch (error) {
      console.error("Error updating deal stage:", error?.message || error);
      throw error;
    }
  },

  async getDealsByStage() {
    try {
      const deals = await this.getAll();
      const dealsByStage = {};
      
      dealStages.forEach(stage => {
        dealsByStage[stage] = deals.filter(deal => deal.stage_c === stage);
      });

      return dealsByStage;
    } catch (error) {
      console.error("Error getting deals by stage:", error?.message || error);
      return {};
    }
  },

  getDealStages() {
    return [...dealStages];
  }
};