// Shape of the identity the API Gateway attaches to every forwarded request.
// This subsystem NEVER issues, verifies, or decodes a JWT itself (see auth-contract.md,
// "SUBSYSTEMS MUST NOT VERIFY JWT SIGNATURE DIRECTLY. ALWAYS USE API GATEWAY.").
// It only trusts the three headers the Gateway sets after it has already verified the token.
export interface GatewayIdentity {
  username: string;
  layer1Role: 'student' | 'alumni' | 'staff' | 'admin';
  faculty: string;
}
