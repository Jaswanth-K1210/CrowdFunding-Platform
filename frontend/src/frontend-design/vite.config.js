import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // Redirect the real services/store to mocks — pages import unchanged
      "../../services/campaignService": path.resolve("src/mock/services.js"),
      "../../services/donationService":  path.resolve("src/mock/services.js"),
      "../../services/authService":      path.resolve("src/mock/services.js"),
      "../../store/authStore":           path.resolve("src/mock/authStore.js"),
      "../../utils/formatCurrency":      path.resolve("src/mock/formatCurrency.js"),
    },
  },
});
