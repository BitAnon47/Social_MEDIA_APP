// Role check middleware: takes roles as param and returns middleware
export const authChecker = (requiredRoles) => {
  return async (req, res, next) => {
    try {
      console.log("🔍 req.user:", req.user);

      // Extract `roleName` from request user
      const roleName = req.user.roleName?.toLowerCase(); // Convert role to lowercase for consistency
      console.log(req.user.roleName);
      if (!roleName) {
        return res.status(403).json({ message: "Unauthorized: Role not found" });
      }

      // 🔥 Validate if user role is allowed
      if (!requiredRoles.includes(roleName)) {
        return res.status(403).json({ error: `Access denied: Requires role(s) ${requiredRoles.join(', ')}` });
      }

      next(); // ✅ Proceed if role matches
    } catch (error) {
      console.error("AuthChecker Error:", error);
      res.status(500).json({ message: "Authorization check failed", error });
    }
  };
};