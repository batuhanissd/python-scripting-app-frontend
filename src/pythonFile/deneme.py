import time
from datetime import datetime

def write():
    date = datetime.now()
    with open("DenemeDosyasi.txt", "w") as dosya:
        dosya.write(str(date) + "\n")

print("İşlem başladı...")

write();

time.sleep(5)  # 5 saniye bekler
print("İşlem bitti.")