class CybersecurityAssistant:

    def __init__(self):
        self.name = "Cybersecurity Assistant"

    def get_response(self, question):
        question = question.lower().strip()

        if "password" in question:
            return "Use a strong, unique password and enable multi-factor authentication."

        if "phishing" in question:
            return "Phishing is an attempt to trick users into revealing sensitive information."

        if "malware" in question:
            return "Malware is malicious software designed to harm, disrupt, or gain unauthorized access."

        if "firewall" in question:
            return "A firewall monitors and controls network traffic based on security rules."

        if "vpn" in question:
            return "A VPN creates an encrypted connection between your device and a VPN server."

        return (
            "I can help you with cybersecurity topics such as "
            "password security, phishing, malware, firewalls and network security."
        )


assistant = CybersecurityAssistant()