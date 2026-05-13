import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type PlanType = "monthly" | "annually";

interface PaymentState {
  planId: string;
  planType: PlanType | null;
  clientSecret: string | null;
}

const initialState: PaymentState = {
  planId: "",
  planType: null,
  clientSecret: null,
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    setPlan: (
      state,
      action: PayloadAction<{ planId: string; planType: PlanType }>,
    ) => {
      state.planId = action.payload.planId;
      state.planType = action.payload.planType;
    },

    // NEW: store client secret
    setClientSecret: (state, action: PayloadAction<string>) => {
      state.clientSecret = action.payload;
    },
    resetPlan: () => initialState,
  },
});

export const { setPlan, resetPlan, setClientSecret } = paymentSlice.actions;
export default paymentSlice.reducer;
