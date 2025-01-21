import * as vscode from 'vscode';
// import { extension_name } from '../../constants';
import { register_dir_context_react_webpack_create } from '../directory_context/react_webpack';
import { register_dir_context_react_vite_create } from '../directory_context/react_vite';
import { register_dir_context_nest_create } from '../directory_context/nest';
import { register_dir_context_create_spring_boot } from '../directory_context/java_springboot';
import { register_dir_context_create_react_native1 } from '../directory_context/react_native';
import { register_dir_context_create_flutter1 } from '../directory_context/flutter';
import { register_dir_context_create_node_express } from '../directory_context/node_express';
import { register_dir_context_rust_axum } from '../directory_context/rust_axum';
import { register_dir_context_scala_play } from '../directory_context/scala_play';
import { register_dir_context_create_go_echo } from '../directory_context/go_echo';
import { register_dir_context_nextjs_shadcn_create } from '../directory_context/nextjs_shadcn';
import { register_dir_context_react_vite_create2 } from '../directory_context/react_vite2';
import { register_dir_context_create_android_kotlin } from '../directory_context/android_kotlin';
import { register_dir_context_create_angular } from '../directory_context/angular';
import { register_dir_context_create_apache_airflow } from '../directory_context/apache_airflow';
import { register_dir_context_create_asp_net_core } from '../directory_context/asp_net_core';
import { register_dir_context_create_astro } from '../directory_context/astro';
import { register_dir_context_create_bot_discord } from '../directory_context/bot_discord';
import { register_dir_context_create_bot_telegram } from '../directory_context/bot_telegram';
import { register_dir_context_create_bot_slack } from '../directory_context/bot_slack';
import { register_dir_context_create_clojure_compojure } from '../directory_context/clojure_compojure';
import { register_dir_context_create_clojure_luminus } from '../directory_context/clojure_luminus';
import { register_dir_context_create_cloud_aws } from '../directory_context/cloud_aws';
import { register_dir_context_create_cloud_azure } from '../directory_context/cloud_azure';
import { register_dir_context_create_cloud_gcp } from '../directory_context/cloud_gcp';
import { register_dir_context_create_cpp_library } from '../directory_context/cpp_library';
import { register_dir_context_create_dapp } from '../directory_context/dapp';
import { register_dir_context_create_deno } from '../directory_context/deno';
import { register_dir_context_create_desktop_electron } from '../directory_context/desktop_electron';
import { register_dir_context_create_desktop_javafx } from '../directory_context/desktop_javafx';
import { register_dir_context_create_desktop_scalafx } from '../directory_context/desktop_scalafx';
import { register_dir_context_create_desktop_tkinter } from '../directory_context/desktop_tkinter';
import { register_dir_context_create_desktop_pyqt6 } from '../directory_context/desktop_pyqt6';
import { register_dir_context_create_django } from '../directory_context/django';
import { register_dir_context_create_devops_docker } from '../directory_context/devops_docker';
import { register_dir_context_create_devops_kubernetes } from '../directory_context/devops_kubernetes';
import { register_dir_context_create_devops_terraform } from '../directory_context/devops_terraform';
import { register_dir_context_create_extension_chrome } from '../directory_context/extension_chrome';
import { register_dir_context_create_extension_firefox } from '../directory_context/extension_firefox';
import { register_dir_context_create_extension_vscode } from '../directory_context/extension_vscode';
import { register_dir_context_create_fastapi } from '../directory_context/fastapi';
import { register_dir_context_create_flask } from '../directory_context/flask';
import { register_dir_context_create_go_cli } from '../directory_context/go_cli';
import { register_dir_context_create_go_fasthttp } from '../directory_context/go_fasthttp';
import { register_dir_context_create_go_beego } from '../directory_context/go_beego';
import { register_dir_context_create_go_fiber } from '../directory_context/go_fiber';
import { register_dir_context_create_go_gin } from '../directory_context/go_gin';
import { register_dir_context_create_go_gorilla } from '../directory_context/go_gorilla';
import { register_dir_context_create_haskell_library } from '../directory_context/haskell_library';
import { register_dir_context_create_java_dropwizard } from '../directory_context/java_dropwizard';
import { register_dir_context_create_java_jakartaee } from '../directory_context/java_jakartaee';
import { register_dir_context_create_java_micronaut } from '../directory_context/java_micronaut';
import { register_dir_context_create_java_quarkus } from '../directory_context/java_quarkus';
import { register_dir_context_create_java_selenium } from '../directory_context/java_selenium';
import { register_dir_context_create_java_vaadin } from '../directory_context/java_vaadin';
import { register_dir_context_create_kafka_go } from '../directory_context/kafka_go';
import { register_dir_context_create_java_vertx } from '../directory_context/java_vertx';
import { register_dir_context_create_kafka_python } from '../directory_context/kafka_python';
import { register_dir_context_create_kafka_java } from '../directory_context/kafka_java';
import { register_dir_context_create_kafka_scala } from '../directory_context/kafka_scala';
import { register_dir_context_create_laravel } from '../directory_context/laravel';
import { register_dir_context_create_mqtt_python } from '../directory_context/mqtt_python';
import { register_dir_context_create_mqtt_go } from '../directory_context/mqtt_go';
import { register_dir_context_create_mqtt_java } from '../directory_context/mqtt_java';
import { register_dir_context_create_nextjs_material } from '../directory_context/nextjs_material';
import { register_dir_context_create_node_fastify } from '../directory_context/node_fastify';
import { register_dir_context_create_npm_package } from '../directory_context/npm_package';
import { register_dir_context_create_openapi_swagger } from '../directory_context/openapi_swagger';
import { register_dir_context_create_phoenix } from '../directory_context/phoenix';
import { register_dir_context_create_protobuf_grpc } from '../directory_context/protobuf_grpc';
import { register_dir_context_create_python_asyncio_celery } from '../directory_context/python_asyncio_celery';
import { register_dir_context_create_python_package } from '../directory_context/python_package';
import { register_dir_context_create_python_pandas } from '../directory_context/python_pandas';
import { register_dir_context_create_python_pytorch } from '../directory_context/python_pytorch';
import { register_dir_context_create_python_selenium } from '../directory_context/python_selenium';
import { register_dir_context_create_python_tensorflow } from '../directory_context/python_tensorflow';
import { register_dir_context_create_ruby_on_rails } from '../directory_context/rails';
import { register_dir_context_create_react_cra } from '../directory_context/react_cra';
import { register_dir_context_create_remix } from '../directory_context/remix';
import { register_dir_context_create_ruby_library } from '../directory_context/ruby_library';
import { register_dir_context_create_rust_actix } from '../directory_context/rust_actix';
import { register_dir_context_create_rust_rocket } from '../directory_context/rust_rocket';
import { register_dir_context_create_rust_tokio } from '../directory_context/rust_tokio';
import { register_dir_context_create_scala_akka } from '../directory_context/scala_akka';
import { register_dir_context_create_scala_cats } from '../directory_context/scala_cats';
import { register_dir_context_create_scala_spark } from '../directory_context/scala_spark';
import { register_dir_context_create_scala_zio } from '../directory_context/scala_zio';
import { register_dir_context_create_scraping_bs4 } from '../directory_context/scraping_bs4';
import { register_dir_context_create_scraping_cheerio } from '../directory_context/scraping_cheerio';
import { register_dir_context_create_scraping_colly } from '../directory_context/scraping_colly';
import { register_dir_context_create_scraping_goquery } from '../directory_context/scraping_goquery';
import { register_dir_context_create_scraping_playwright } from '../directory_context/scraping_playwright';
import { register_dir_context_create_scraping_scrapy } from '../directory_context/scraping_scrapy';
import { register_dir_context_create_scraping_jsoup } from '../directory_context/scraping_jsoup';
import { register_dir_context_create_scraping_puppeteer } from '../directory_context/scraping_puppeteer';
import { register_dir_context_create_svelte } from '../directory_context/svelte';
import { register_dir_context_create_tauri } from '../directory_context/tauri';
import { register_dir_context_create_vue_vite } from '../directory_context/vue_vite';
import { register_dir_context_create_web3 } from '../directory_context/web3';
import { register_dir_context_create_webrtc } from '../directory_context/webrtc';
import { register_dir_context_create_websocket_mobile } from '../directory_context/websocket_mobile';
import { register_dir_context_create_websocket_web } from '../directory_context/websocket_web';

export function register_project_menu(context: vscode.ExtensionContext) {
	// "yutools.submenuFrontend": [
	//   {
	//     "command": "yutools.dir_context_react_webpack_create",
	//     "group": "Create Frontend",
	//     "when": "explorerResourceIsFolder"
	//   },
	register_dir_context_react_webpack_create(context);
	//   {
	//     "command": "yutools.dir_context_react_vite_create",
	//     "group": "Create Frontend",
	//     "when": "explorerResourceIsFolder"
	//   },
	register_dir_context_react_vite_create(context);
	register_dir_context_react_vite_create2(context);
	//   {
	//     "command": "yutools.dir_context_nest_create",
	//     "group": "Create Frontend",
	//     "when": "explorerResourceIsFolder"
	//   },
	register_dir_context_nest_create(context);
	//   {
	//     "command": "yutools.dir_context_create_spring_boot",
	//     "group": "Create Frontend",
	//     "when": "explorerResourceIsFolder"
	//   },
	register_dir_context_create_spring_boot(context);
	//   {
	//     "command": "yutools.dir_context_create_react_native1",
	//     "group": "Create Frontend",
	//     "when": "explorerResourceIsFolder"
	//   },
	register_dir_context_create_react_native1(context);
	//   {
	//     "command": "yutools.dir_context_create_flutter1",
	//     "group": "Create Frontend",
	//     "when": "explorerResourceIsFolder"
	//   },
	register_dir_context_create_flutter1(context);
	//   {
	//     "command": "yutools.dir_context_create_node_express",
	//     "group": "Create Frontend",
	//     "when": "explorerResourceIsFolder"
	//   },
	register_dir_context_create_node_express(context);
	//   {
	//     "command": "yutools.dir_context_rust_axum",
	//     "group": "Create Frontend",
	//     "when": "explorerResourceIsFolder"
	//   },
	register_dir_context_rust_axum(context);
	//   {
	//     "command": "yutools.dir_context_scala_play",
	//     "group": "Create Frontend",
	//     "when": "explorerResourceIsFolder"
	//   },
	register_dir_context_scala_play(context);
	//   {
	//     "command": "yutools.dir_context_create_go_echo",
	//     "group": "Create Frontend",
	//     "when": "explorerResourceIsFolder"
	//   },
	register_dir_context_create_go_echo(context);
	//   {
	//     "command": "yutools.dir_context_nextjs_shadcn_create",
	//     "group": "Create Frontend",
	//     "when": "explorerResourceIsFolder"
	//   }
	register_dir_context_nextjs_shadcn_create(context);
	// ],

	register_dir_context_create_android_kotlin(context);
	register_dir_context_create_angular(context);
	register_dir_context_create_apache_airflow(context);
	register_dir_context_create_asp_net_core(context);
	register_dir_context_create_astro(context);
	register_dir_context_create_bot_discord(context);
	register_dir_context_create_bot_telegram(context);
	register_dir_context_create_bot_slack(context);
	register_dir_context_create_clojure_compojure(context);
	register_dir_context_create_clojure_luminus(context);
	register_dir_context_create_cloud_aws(context);
	register_dir_context_create_cloud_azure(context);
	register_dir_context_create_cloud_gcp(context);
	register_dir_context_create_cpp_library(context);
	register_dir_context_create_dapp(context);
	register_dir_context_create_deno(context);
	register_dir_context_create_desktop_electron(context);
	register_dir_context_create_desktop_javafx(context);
	register_dir_context_create_desktop_pyqt6(context);
	register_dir_context_create_desktop_scalafx(context);
	register_dir_context_create_desktop_tkinter(context);
	register_dir_context_create_django(context);
	register_dir_context_create_devops_docker(context);
	register_dir_context_create_devops_kubernetes(context);
	register_dir_context_create_devops_terraform(context);
	register_dir_context_create_extension_chrome(context);
	register_dir_context_create_extension_firefox(context);
	register_dir_context_create_extension_vscode(context);
	register_dir_context_create_fastapi(context);
	register_dir_context_create_flask(context);
	register_dir_context_create_go_cli(context);
	register_dir_context_create_go_fasthttp(context);
	register_dir_context_create_go_beego(context);
	register_dir_context_create_go_fiber(context);
	register_dir_context_create_go_gin(context);
	register_dir_context_create_go_gorilla(context);
	register_dir_context_create_haskell_library(context);
	register_dir_context_create_java_dropwizard(context);
	register_dir_context_create_java_jakartaee(context);
	register_dir_context_create_java_micronaut(context);
	register_dir_context_create_java_quarkus(context);
	register_dir_context_create_java_selenium(context);
	register_dir_context_create_java_vaadin(context);
	register_dir_context_create_java_vertx(context);
	register_dir_context_create_kafka_go(context);
	register_dir_context_create_kafka_python(context);
	register_dir_context_create_kafka_java(context);
	register_dir_context_create_kafka_scala(context);
	register_dir_context_create_laravel(context);
	register_dir_context_create_mqtt_python(context);
	register_dir_context_create_mqtt_go(context);
	register_dir_context_create_mqtt_java(context);
	register_dir_context_create_nextjs_material(context);
	register_dir_context_create_node_fastify(context);
	register_dir_context_create_npm_package(context);
	register_dir_context_create_openapi_swagger(context);
	register_dir_context_create_phoenix(context);
	register_dir_context_create_protobuf_grpc(context);
	register_dir_context_create_python_asyncio_celery(context);
	register_dir_context_create_python_package(context);
	register_dir_context_create_python_pandas(context);
	register_dir_context_create_python_pytorch(context);
	register_dir_context_create_python_selenium(context);
	register_dir_context_create_python_tensorflow(context);
	register_dir_context_create_ruby_on_rails(context);
	register_dir_context_create_react_cra(context);
	register_dir_context_create_remix(context);
	register_dir_context_create_ruby_library(context);
	register_dir_context_create_rust_actix(context);
	register_dir_context_create_rust_rocket(context);
	register_dir_context_create_rust_tokio(context);
	register_dir_context_create_scala_akka(context);
	register_dir_context_create_scala_cats(context);
	register_dir_context_create_scala_spark(context);
	register_dir_context_create_scala_zio(context);
	register_dir_context_create_scraping_bs4(context);
	register_dir_context_create_scraping_cheerio(context);
	register_dir_context_create_scraping_colly(context);
	register_dir_context_create_scraping_goquery(context);
	register_dir_context_create_scraping_jsoup(context);
	register_dir_context_create_scraping_playwright(context);
	register_dir_context_create_scraping_puppeteer(context);
	register_dir_context_create_scraping_scrapy(context);
	register_dir_context_create_svelte(context);
	register_dir_context_create_tauri(context);
	register_dir_context_create_vue_vite(context);
	register_dir_context_create_web3(context);
	register_dir_context_create_webrtc(context);
	register_dir_context_create_websocket_mobile(context);
	register_dir_context_create_websocket_web(context);
}
