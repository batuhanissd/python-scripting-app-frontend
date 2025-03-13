import psycopg2
from psycopg2.extras import DictCursor
from selenium import webdriver
from selenium.webdriver.firefox.service import Service
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.common.by import By
import time
import requests

db_config = {
    "dbname": "pts_main",
    "user": "postgres",
    "password": "issd20092009issd",
    "host": "10.5.0.15",
    "port": "5432",
}

def fetch_bios_ip_list():
    query = """
    SELECT "biosId", "ipAddress"
    FROM pts_definition.camera
    WHERE "biosId" SIMILAR TO '(10|11|12|13|14|15|16|17|18|19|20|21|22|23|24|25|26|27|28|29|30|31|32|33|34|35|36|37|38|39|40|41|42|43|44|45|46|47|48|49|50|51|52|53|54|55|56|57|58|59|60|61|62|63|64|65|66|67|68|69|70|71|72|73|74)%'
    ORDER BY "ipAddress";
    """
    try:
        conn = psycopg2.connect(**db_config)
        with conn.cursor(cursor_factory=DictCursor) as cur:
            cur.execute(query)
            result = cur.fetchall()
        return [{"biosId": row["biosId"], "ipAddress": row["ipAddress"]} for row in result]
    except Exception as e:
        print("Error fetching data from PostgreSQL:", e)
        return []
    finally:
        conn.close()

bios_ip_list = fetch_bios_ip_list()
# Firefox için başsız seçenekler
firefox_options = Options()
firefox_options.add_argument("--headless")  # Tarayıcıyı başsız çalıştırmak için

# GeckoDriver yolu
driver_path = "/Users/muhammedyayik/Downloads/geckodriver"

# Her cihaz için döngü
for item in bios_ip_list:
    bios_id = item["biosId"]
    ip_address = item["ipAddress"]

    # İlk iki karakteri al ve port numarasını oluştur
    bios_prefix = bios_id[:2]  # İlk iki karakter (örneğin "49" veya "48")
    port_no = f"21{bios_prefix}"

    # Selenium ile giriş yap ve SessionTag'i al
    try:
        # Selenium ile giriş yap ve SessionTag'i al
        driver = webdriver.Firefox(service=Service(driver_path), options=firefox_options)
        driver.get(f"http://{ip_address}/")  # IP'yi parametrik hale getirdik

        # Sayfanın yüklenmesini bekleyin (Kullanıcı adı ve şifre alanları)
        username_field = driver.find_element(By.ID, "username")
        password_field = driver.find_element(By.ID, "password")
        login_button = driver.find_element(By.CSS_SELECTOR, "button[ng-click='login()']")

        # Kullanıcı adı ve şifreyi gir
        username_field.send_keys("admin")
        password_field.send_keys("issd2009")

        # Giriş yap
        login_button.click()

        # Giriş işleminin tamamlanması için bekleyin
        time.sleep(5)

        # Session Storage'dan sessiontag değerini al
        session_tag = driver.execute_script("return sessionStorage.getItem('sessionTag');")
        print(f"Session Tag for {ip_address}:", session_tag)

    except Exception as e:
        print(f"Hata oluştu: {ip_address} için Selenium giriş işleminde sorun var.")
        print(f"Hata Mesajı: {str(e)}")
        driver.quit()
        continue  # Bir sonraki cihaz için döngüye geç

    finally:
        driver.quit()

    # XML verisi (Tamamen sabit yapıldı, sadece portNo dinamik olarak değişiyor)
    xml_data = f'''
<?xml version: "1.0" encoding="UTF-8"?>
<FTPNotificationList
	xmlns="http://www.isapi.org/ver20/XMLSchema" version="2.0">
	<FTPNotification>
		<id>1</id>
		<enabled>true</enabled>
		<addressingFormatType>ipaddress</addressingFormatType>
		<ipAddress>10.5.0.15</ipAddress>
		<portNo>{port_no}</portNo>
		<userName>ftp_anpr</userName>
		<uploadPath>
			<pathDepth>3</pathDepth>
			<topDirNameRule>time_date</topDirNameRule>
			<topDirName/>
			<subDirNameRule>time_hour</subDirNameRule>
			<subDirName/>
			<threeDirNameRule>customize</threeDirNameRule>
			<threeDirName>{bios_id}</threeDirName>
			<fourDirNameRule>none</fourDirNameRule>
			<fourDirName/>
			<fiveDirNameRule>none</fiveDirNameRule>
			<fiveDirName/>
			<sixDirNameRule>none</sixDirNameRule>
			<sixDirName/>
		</uploadPath>
		<ftpPicNameRuleType>ITC</ftpPicNameRuleType>
		<FTPPicNameRule>
			<ItemList>
				<Item>
					<itemID>1</itemID>
					<itemOrder>plateNo</itemOrder>
					<itemCustomStr/>
				</Item>
				<Item>
					<itemID>2</itemID>
					<itemOrder>regionNation</itemOrder>
					<itemCustomStr/>
				</Item>
				<Item>
					<itemID>3</itemID>
					<itemOrder>custom</itemOrder>
					<itemCustomStr>{bios_id}</itemCustomStr>
				</Item>
				<Item>
					<itemID>4</itemID>
					<itemOrder>time</itemOrder>
					<itemCustomStr/>
				</Item>
				<Item>
					<itemID>5</itemID>
					<itemOrder>platePosition</itemOrder>
					<itemCustomStr/>
				</Item>
				<Item>
					<itemID>6</itemID>
					<itemOrder>carType</itemOrder>
					<itemCustomStr/>
				</Item>
				<Item>
					<itemID>7</itemID>
					<itemOrder>vehicleLogo</itemOrder>
					<itemCustomStr/>
				</Item>
				<Item>
					<itemID>8</itemID>
					<itemOrder>carColor</itemOrder>
					<itemCustomStr/>
				</Item>
				<Item>
					<itemID>9</itemID>
					<itemOrder>carSpeed</itemOrder>
					<itemCustomStr/>
				</Item>
				<Item>
					<itemID>10</itemID>
					<itemOrder>laneNo</itemOrder>
					<itemCustomStr/>
				</Item>
				<Item>
					<itemID>11</itemID>
					<itemOrder>CarNo</itemOrder>
					<itemCustomStr/>
				</Item>
				<Item>
					<itemID>12</itemID>
					<itemOrder>none</itemOrder>
					<itemCustomStr/>
				</Item>
				<Item>
					<itemID>13</itemID>
					<itemOrder>none</itemOrder>
					<itemCustomStr/>
				</Item>
				<Item>
					<itemID>14</itemID>
					<itemOrder>none</itemOrder>
					<itemCustomStr/>
				</Item>
				<Item>
					<itemID>15</itemID>
					<itemOrder>none</itemOrder>
					<itemCustomStr/>
				</Item>
			</ItemList>
			<delimiter>=</delimiter>
			<customStr>{bios_id}</customStr>
		</FTPPicNameRule>
		<upDataType>0</upDataType>
		<uploadPlateEnable>true</uploadPlateEnable>
		<site/>
		<roadNum/>
		<instrumentNum/>
		<direction/>
		<directionDesc/>
		<monitoringInfo1/>
		<uploadAttachedInfomation>false</uploadAttachedInfomation>
		<pathEncodingMode>utf-8</pathEncodingMode>
		<uploadFaceEnable>false</uploadFaceEnable>
		<uploadTargetEnable>false</uploadTargetEnable>
		<uploadProtocolType>FTP</uploadProtocolType>
		<attachedInfomationTypeList>
			<attachedInfomationType>
				<type/>
			</attachedInfomationType>
		</attachedInfomationTypeList>
		<connectMode>shortConnect</connectMode>
		<password>Jakarta!61</password>
	</FTPNotification>
	<FTPNotification>
		<id>2</id>
		<enabled>false</enabled>
		<addressingFormatType>ipaddress</addressingFormatType>
		<ipAddress>10.5.0.15</ipAddress>
		<portNo>{port_no}</portNo>
		<userName>ftp_anpr</userName>
		<uploadPath>
			<pathDepth>3</pathDepth>
			<topDirNameRule>time_date</topDirNameRule>
			<topDirName/>
			<subDirNameRule>time_hour</subDirNameRule>
			<subDirName/>
			<threeDirNameRule>customize</threeDirNameRule>
			<threeDirName>{bios_id}</threeDirName>
			<fourDirNameRule>none</fourDirNameRule>
			<fourDirName/>
			<fiveDirNameRule>none</fiveDirNameRule>
			<fiveDirName/>
			<sixDirNameRule>none</sixDirNameRule>
			<sixDirName/>
		</uploadPath>
		<ftpPicNameRuleType>ITC</ftpPicNameRuleType>
		<FTPPicNameRule>
			<ItemList>
				<Item>
					<itemID>1</itemID>
					<itemOrder>plateNo</itemOrder>
					<itemCustomStr/>
				</Item>
				<Item>
					<itemID>2</itemID>
					<itemOrder>regionNation</itemOrder>
					<itemCustomStr/>
				</Item>
				<Item>
					<itemID>3</itemID>
					<itemOrder>custom</itemOrder>
					<itemCustomStr/>
				</Item>
				<Item>
					<itemID>4</itemID>
					<itemOrder>time</itemOrder>
					<itemCustomStr/>
				</Item>
				<Item>
					<itemID>5</itemID>
					<itemOrder>platePosition</itemOrder>
					<itemCustomStr/>
				</Item>
				<Item>
					<itemID>6</itemID>
					<itemOrder>carType</itemOrder>
					<itemCustomStr/>
				</Item>
				<Item>
					<itemID>7</itemID>
					<itemOrder>vehicleLogo</itemOrder>
					<itemCustomStr/>
				</Item>
				<Item>
					<itemID>8</itemID>
					<itemOrder>carColor</itemOrder>
					<itemCustomStr/>
				</Item>
				<Item>
					<itemID>9</itemID>
					<itemOrder>carSpeed</itemOrder>
					<itemCustomStr/>
				</Item>
				<Item>
					<itemID>10</itemID>
					<itemOrder>laneNo</itemOrder>
					<itemCustomStr/>
				</Item>
				<Item>
					<itemID>11</itemID>
					<itemOrder>CarNo</itemOrder>
					<itemCustomStr/>
				</Item>
				<Item>
					<itemID>12</itemID>
					<itemOrder>none</itemOrder>
					<itemCustomStr/>
				</Item>
				<Item>
					<itemID>13</itemID>
					<itemOrder>none</itemOrder>
					<itemCustomStr/>
				</Item>
				<Item>
					<itemID>14</itemID>
					<itemOrder>none</itemOrder>
					<itemCustomStr/>
				</Item>
				<Item>
					<itemID>15</itemID>
					<itemOrder>none</itemOrder>
					<itemCustomStr/>
				</Item>
			</ItemList>
			<delimiter>=</delimiter>
			<customStr>{bios_id}</customStr>
		</FTPPicNameRule>
		<upDataType>0</upDataType>
		<uploadPlateEnable>true</uploadPlateEnable>
		<site/>
		<roadNum/>
		<instrumentNum/>
		<direction/>
		<directionDesc/>
		<monitoringInfo1/>
		<uploadAttachedInfomation>false</uploadAttachedInfomation>
		<pathEncodingMode>utf-8</pathEncodingMode>
		<uploadFaceEnable>false</uploadFaceEnable>
		<uploadTargetEnable>false</uploadTargetEnable>
		<uploadProtocolType>FTP</uploadProtocolType>
		<attachedInfomationTypeList/>
		<connectMode>shortConnect</connectMode>
		<password>Jakarta!61</password>
	</FTPNotification>
</FTPNotificationList>
    '''

    try:
        # HTTP PUT isteğini gönder
        url = f"http://{ip_address}/ISAPI/System/Network/ftp"
        headers = {
            "Content-Type": "application/xml",
            "Sessiontag": session_tag,
        }

        response = requests.put(url, headers=headers, data=xml_data)
        print(f"Sent to {ip_address} with biosId {bios_id}")
        print("Response Status Code:", response.status_code)
        print("Response Text:", response.text)

    except Exception as e:
        print(f"Hata oluştu: {ip_address} için XML gönderimi sırasında sorun var.")
        print(f"Hata Mesajı: {str(e)}")
        continue  # Bir sonraki cihaz için döngüye geç