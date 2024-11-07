import { Input } from "@/components/ui/input";
export  function EmailInput() {
  return (
    <div
      className="space-y-2"
      style={{ "--ring": "234 89% 74%" } as React.CSSProperties}>
      <Input id="input-05" placeholder="rishipatel0826@gmail.com" className="bg-[#27272B] border-2 border-[#2D2D2D]" type="email" />
    </div>
  );
}
export  function PasswordInput() {
  return (
    <div
      className="space-y-2"
      style={{ "--ring": "234 89% 74%" } as React.CSSProperties}>
      <Input id="input-06" placeholder="********" className="bg-[#27272B] border-2 border-[#2D2D2D]" type="password" autoComplete="true" />
    </div>
  );
}
export function NameInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-2" style={{ "--ring": "234 89% 74%" } as React.CSSProperties}>
      <Input
        {...props} // Spread props here
        className={`bg-[#27272B] border-2 border-[#2D2D2D] ${props.className || ''}`} 
      />
    </div>
  );
}

export function DescInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-2" style={{ "--ring": "234 89% 74%" } as React.CSSProperties}>
      <Input
        {...props} // Spread props here
        className={`bg-[#27272B]  border-2 border-[#2D2D2D] ${props.className || ''}`} 
      />
    </div>
  );
}